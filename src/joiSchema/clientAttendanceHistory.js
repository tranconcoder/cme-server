const Joi = require("joi");

const clientCreateAttendanceHistory = Joi.object().keys({
	googleId: Joi.string().length(21).required(),
	attendanceData: Joi.array().min(0).required(),
	chats: Joi.array().min(0).required(),
	classInfoName: Joi.string().min(1).required(),
	startAttendanceAt: Joi.object().keys({
		years: Joi.string().length(4).required(),
		months: Joi.string().length(2).required(),
		weekDays: Joi.string().length(2).required(),
		dates: Joi.string().length(2).required(),
		hours: Joi.string().length(2).required(),
		minutes: Joi.string().length(2).required(),
		seconds: Joi.string().length(2).required(),
	}),
	endAttendanceAt: Joi.object().keys({
		years: Joi.string().length(4).required(),
		months: Joi.string().length(2).required(),
		weekDays: Joi.string().length(2).required(),
		dates: Joi.string().length(2).required(),
		hours: Joi.string().length(2).required(),
		minutes: Joi.string().length(2).required(),
		seconds: Joi.string().length(2).required(),
	}),
	totalTimeLearning: Joi.number().min(0).required(),
});

const clientDeleteAttendanceHistory = Joi.object().keys({
	_id: Joi.string().length(24).required(),
	googleId: Joi.string().length(21).required(),
});

module.exports = { clientCreateAttendanceHistory, clientDeleteAttendanceHistory };
