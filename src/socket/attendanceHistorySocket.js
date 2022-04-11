const { io } = require("../index");
const {
	socket: { socketAuthToken },
} = require("../middleware");

const attendanceHistorySocket = io.of("/attendance-history");

attendanceHistorySocket.on("connection", (socket) => {
	socket.join(socket.googleId);
});

attendanceHistorySocket.use(socketAuthToken);

const emitAddAttendanceHistory = (googleId, newAttendanceHistory) => {
	attendanceHistorySocket.to(googleId).emit("add-attendance-history", newAttendanceHistory);
};

const emitDeleteAttendanceHistory = (googleId, attendanceHistoryIdToDelete) => {
	attendanceHistorySocket
		.to(googleId)
		.emit("delete-attendance-history", attendanceHistoryIdToDelete);
};

module.exports = {
	emitAddAttendanceHistory,
	emitDeleteAttendanceHistory,
};
