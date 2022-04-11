const { io } = require("../index.js");

const {
	emitChangeClassInfo,
	emitCreateClassInfo,
	emitDeleteClassInfo,
} = require("./classInfoSocket");

const { emitCreateGroup, emitChangeGroup, emitDeleteGroup } = require("./groupsSocket");

const {
	emitAddAttendanceHistory,
	emitDeleteAttendanceHistory,
} = require("./attendanceHistorySocket");

module.exports = {
	io,
	classInfoSocket: {
		emitChangeClassInfo,
		emitCreateClassInfo,
		emitDeleteClassInfo,
	},
	groupSocket: {
		emitCreateGroup,
		emitChangeGroup,
		emitDeleteGroup,
	},
	attendanceHistory: {
		emitAddAttendanceHistory,
		emitDeleteAttendanceHistory,
	},
};
