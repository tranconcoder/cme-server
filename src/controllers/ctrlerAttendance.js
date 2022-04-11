const Joi = require("joi");

const attendanceDb = require("../resources/config/models/attendance");
const { clientCreateAttendanceHistory, clientDeleteAttendanceHistory } = require("../joiSchema");
const {
	attendanceHistory: { emitAddAttendanceHistory, emitDeleteAttendanceHistory },
} = require("../socket");

class Attendance {
	getAll(req, res) {
		const { googleId } = req.jwtPayload;

		attendanceDb.find({ googleId }, (errors, attendanceHistoryList) => {
			if (errors) {
				return res.status(500).send(errors);
			}

			if (!attendanceHistoryList) {
				return res.status(404).send("Not found attendanceHistory in Db.");
			}

			return res.status(200).json(attendanceHistoryList);
		});
	}

	async add(req, res) {
		try {
			const { googleId } = req.jwtPayload;

			const attendanceInfoToSave = await clientCreateAttendanceHistory.validateAsync({
				...req.body,
				googleId,
			});

			attendanceDb
				.create(attendanceInfoToSave)
				.then(attendanceInfoCreated => {
					emitAddAttendanceHistory(googleId, attendanceInfoCreated);

					res.status(201).json(attendanceInfoCreated);
				})
				.catch(errors => res.status(500).send(errors));
		} catch (errors) {
			return res.status(401).send(errors);
		}
	}

	delete(req, res) {
		const { googleId } = req.jwtPayload;
		const { attendanceHistoryIdToDelete } = req.query;

		const { value: attendanceInfoToDelete, errors } = clientDeleteAttendanceHistory.validate({
			googleId,
			_id: attendanceHistoryIdToDelete,
		});

		if (errors) {
			return res.status(401).send(errors);
		}

		attendanceDb
			.deleteOne(attendanceInfoToDelete)
			.then(() => {
				emitDeleteAttendanceHistory(googleId, attendanceHistoryIdToDelete);

				res.sendStatus(200);
			})
			.catch(errors => {
				res.send(500).send(errors);
			});
	}
}

module.exports = new Attendance();
