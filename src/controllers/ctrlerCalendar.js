const { calendar, calendarId } = require("../calendar");

const { missingCredentialsCheck, transformer } = require("../middleware");
const { groupPayloadTransformer } = transformer;
const groupDb = require("../resources/config/models/group");

const {
	groupSocket: { emitCreateGroup, emitChangeGroup, emitDeleteGroup },
} = require("../socket");

class Calendar {
	getAll(req, res) {
		if (!req.jwtPayload.googleId)
			return res.status(401).send("googleId key in jwtPayload is not available");

		const { googleId } = req.jwtPayload;

		groupDb.find({ googleId }, (err, allGroups) => {
			if (err) return res.status(417).send(err || null);

			res.status(200).json(allGroups.map((group) => groupPayloadTransformer(group)));
		});
	}

	create(req, res) {
		try {
			// Verify request
			const requiredKeysInRequest = [
				"classInfoName",
				"name",
				"startAt",
				"endAt",
				"duration",
				"membersInfo",
				"subject",
			];
			const requestPayloadCheckResult = missingCredentialsCheck(
				requiredKeysInRequest,
				req.body,
				res
			);

			if (!requestPayloadCheckResult) return;

			if (!req.jwtPayload.googleId) {
				throw [
					401,
					"Required field in request body: { classInfoName, name, subject, membersInfo, duration, startAt, endAt, }",
				];
			}

			const { googleId, email } = req.jwtPayload;
			const {
				classInfoName,
				name,
				subject,
				membersInfo,
				duration,
				startAt: startAtFromReq,
				endAt: endAtFromReq,
			} = req.body;

			// Enum duration check
			if (!enumDurationCheck(new Date(startAtFromReq), new Date(endAtFromReq))) {
				throw [401, "Duration validation is not allowed!"];
			}

			const summary = `${classInfoName} - ${name} [${subject}]`;

			const attendees = [
				...membersInfo.map((memberInfo) => ({
					email: memberInfo.email,
				})),
				{
					email,
				},
			];

			const startAt = new Date(startAtFromReq);
			startAt.setHours(startAt.getHours() + 7);

			const endAt = new Date(endAtFromReq);
			endAt.setHours(endAt.getHours() + 7);

			const event = {
				summary,
				location: `Chỗ học`,
				description: `Phòng thảo luận nhóm.`,
				colorId: 3,
				attendees,
				start: {
					dateTime: startAt,
					timeZone: "+7",
				},
				end: {
					dateTime: endAt,
					timeZone: "+7",
				},
				conferenceData: {
					createRequest: {
						conferenceSolutionKey: {
							type: "hangoutsMeet",
						},
						requestId: "random string",
					},
				},
				guestsCanInviteOthers: false,
				guestsCanModify: false,
				guestsCanSeeOtherGuests: true,
				reminders: {
					overrides: [
						{
							method: "popup",
							minutes: 10,
						},
					],
					useDefault: false,
				},
			};

			const calendarInsertOption = {
				calendarId: calendarId,
				conferenceDataVersion: 1,
				sendNotifications: false,
				resource: event,
			};
			const calendarInsertCallback = (errors, event) => {
				if (errors) {
					throw [417, `Error inserting calendar: ${errors.message}`];
				} else {
					const startAtLocalUTC = new Date(startAtFromReq);
					const endAtLocalUTC = new Date(endAtFromReq);

					// Save event to groupDb (database)
					groupDb
						.create({
							googleId,
							eventId: event.data.id,
							name,
							classInfoName,
							duration,
							startAt: startAtLocalUTC,
							endAt: endAtLocalUTC,
							googleMeetLink: event.data.hangoutLink,
							membersInfo,
							subject,
						})
						.then((newGroup) => {
							const newGroupTransformed = groupPayloadTransformer(newGroup);

							emitCreateGroup(googleId, newGroupTransformed);

							res.status(201).json(newGroupTransformed);
						})
						.catch((errors) => {
							console.log(errors);
							res.status(500).send(new Error(errors));
						});
				}
			};

			calendar.events.insert(calendarInsertOption, calendarInsertCallback);

			// Enum duration check
			function enumDurationCheck(timeStart, timeEnd) {
				const durationSeconds = (timeEnd.getTime() - timeStart.getTime()) / 1000 / 60;
				const enumDuration = [
					3, 5, 7, 10, 15, 30, 45, 60, 120, 360, 720, 1440, 4320, 10080, 43200, 86400,
				];

				const enumResult = enumDuration.some((enumValue) => enumValue === durationSeconds);

				return enumResult;
			}
		} catch ([code, message]) {
			return res.status(code).send(new Error(message));
		}
	}

	update(req, res) {
		const reqPayloadRequiredKeys = ["googleId", "eventId", "objFieldsToUpdate"];
		const reqPayloadCheckKeysResult = missingCredentialsCheck(
			reqPayloadRequiredKeys,
			req.body,
			res
		);
		if (!reqPayloadCheckKeysResult) return;

		const requiredKeysInObjFieldsToUpdate = [
			"name",
			"classInfoName",
			"startAt",
			"endAt",
			"duration",
			"membersInfo",
			"subject",
		];
		const objFieldsToUpdateCheckKeysResult = missingCredentialsCheck(
			requiredKeysInObjFieldsToUpdate,
			req.body.objFieldsToUpdate,
			res
		);
		if (!objFieldsToUpdateCheckKeysResult) return;

		const { googleId, email } = req.jwtPayload;
		const { eventId, objFieldsToUpdate } = req.body;
		const { classInfoName, name, subject } = objFieldsToUpdate;

		const summary = `${classInfoName} - ${name} [${subject}]`;
		const attendeesObjEmail = [
			...objFieldsToUpdate.membersInfo.map((memberInfo) => ({
				email: memberInfo.email,
			})),
			{ email },
		];

		const startAt = new Date(objFieldsToUpdate.startAt);
		startAt.setHours(startAt.getHours() + 7);

		const endAt = new Date(objFieldsToUpdate.endAt);
		endAt.setHours(endAt.getHours() + 7);

		const newEvent = {
			summary,
			attendees: attendeesObjEmail,
			start: {
				dateTime: startAt,
				timeZone: "+7",
			},
			end: {
				dateTime: endAt,
				timeZone: "+7",
			},
		};

		const updateOption = { calendarId, eventId, requestBody: newEvent };
		const updateHandle = (errors) => {
			if (errors) {
				res.status(417).send("Error while update event in Google Calendar.");
			}

			if (!errors) {
				groupDb.findOneAndUpdate(
					{
						googleId,
						eventId,
					},
					objFieldsToUpdate,
					{ new: true },
					(err, changedGroup) => {
						if (err || !changedGroup) {
							return res.status(417).send("Error while updating groups!");
						}

						if (!changedGroup) {
							return res.status(404).send("Not found event in DB.");
						}

						emitChangeGroup(googleId, changedGroup);

						res.status(200).json(groupPayloadTransformer(changedGroup));
					}
				);
			}
		};

		calendar.events.update(updateOption, updateHandle);
	}

	delete(req, res) {
		if (!req.query.eventId) {
			return res.status(401).send("Missing eventId in request query.");
		}

		const { eventId } = req.query;
		const { googleId } = req.jwtPayload;

		const deleteOption = { calendarId, eventId };
		const deleteHandle = (errors) => {
			if (errors) {
				return res.status(417).send(new Error(errors));
			} else {
				groupDb.deleteOne({ googleId, eventId }, (errors) => {
					if (errors) return res.status(417).send(new Error(errors));

					emitDeleteGroup(googleId, eventId);

					res.sendStatus(204);
				});
			}
		};

		calendar.events.delete(deleteOption, deleteHandle);
	}
}

module.exports = new Calendar();
