const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttendanceHistory = new Schema(
	{
		googleId: {
			type: String,
			required: true,
		},
		attendanceData: { type: Array, default: [] },
		chats: { type: Array, default: [] },
		classInfoName: { type: String, default: "" },
		startAttendanceAt: {
			years: { type: String, default: "2004" },
			months: { type: String, default: "04" },
			weekDays: { type: String, default: "06" },
			dates: { type: String, default: "01" },
			hours: { type: String, default: "11" },
			minutes: { type: String, default: "00" },
			seconds: { type: String, default: "00" },
		},
		endAttendanceAt: {
			years: { type: String, default: "2004" },
			months: { type: String, default: "04" },
			weekDays: { type: String, default: "06" },
			dates: { type: String, default: "01" },
			hours: { type: String, default: "12" },
			minutes: { type: String, default: "00" },
			seconds: { type: String, default: "00" },
		},
		totalTimeLearning: { type: Number, default: 0 },
	},
	{
		timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
	}
);

module.exports = mongoose.model("AttendanceHistory", AttendanceHistory);
