const { io } = require("../index");
const {
	socket: { socketAuthToken },
} = require("../middleware");

const groupSocket = io.of("/group");

groupSocket.on("connection", (socket) => {
	socket.join(socket.googleId);
});

groupSocket.use(socketAuthToken);

const emitCreateGroup = (googleId, newGroup) => {
	groupSocket.to(googleId).emit("create-group", newGroup);
};

const emitChangeGroup = (googleId, changedGroup) => {
	groupSocket.to(googleId).emit("change-group", changedGroup);
};

const emitDeleteGroup = (googleId, eventId) => {
	groupSocket.to(googleId).emit("delete-group", eventId);
};

module.exports = {
	emitCreateGroup,
	emitChangeGroup,
	emitDeleteGroup,
};
