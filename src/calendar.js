const authList = JSON.parse(process.env.AUTH_LIST);

// Init Google Calendar API
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const currentAuthIndex = process.env.AUTH_INDEX;
const oAuth2Client = new OAuth2(
	authList[currentAuthIndex].clientId,
	authList[currentAuthIndex].clientSecret
);

const groupDb = require("./resources/config/models/group");

oAuth2Client.setCredentials({
	refresh_token: authList[currentAuthIndex].refreshToken,
});

const calendarId = authList[currentAuthIndex].calendarId;
const calendar = google.calendar({
	version: "v3",
	auth: oAuth2Client,
});

// Set interval to cleanup after the event time out
setInterval(async () => {
	const nowTime = new Date().getTime();
	const allEvents = (
		await calendar.events.list({
			calendarId,
		})
	).data.items;

	const allEventsTimeout = allEvents
		.map((event) => ({
			time: new Date(event.end.dateTime).getTime(),
			eventId: event.id,
		}))
		.filter((event) => nowTime - event.time > 3 * 24 * 60 * 60 * 1000);

	// Delete allEventsTimeout
	allEventsTimeout.forEach(async (event) => {
		// Delete event on google calendar
		const eventId = event.eventId;

		calendar.events.delete({ calendarId, eventId }, (err, event) => {
			if (err) {
				console.log("Error while deleting event in Google Calendar: " + err);
			} else {
				console.log("Deleted event in Google Calendar (" + eventId + " )");

				// Delete event on DataBase
				groupDb.deleteOne({ eventId }, (error) => {
					if (error) {
						console.log("Error while deleting event in DataBase: ", error);
					} else {
						console.log("Deleted event in Database (" + eventId + " )");
					}
				});
			}
		});
	});
}, 6 * 60 * 60 * 1000);

module.exports = {
	calendar,
	calendarId,
};
