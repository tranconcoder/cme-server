const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Manager = new Schema({
	lastOnlineAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Manager", Manager);
