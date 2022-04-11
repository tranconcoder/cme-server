const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Group = new Schema(
	{
		googleId: { type: String, required: true },
		eventId: { type: String, required: true },
		name: { type: String, required: true },
		classInfoName: { type: String, required: true },
		duration: { type: Number, required: true },
		startAt: { type: Number, required: true },
		endAt: { type: Number, required: true },
		googleMeetLink: { type: String, required: true },
		membersInfo: { type: Array, required: true },
		subject: { type: String, required: true },
	},
	{
		timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
	}
);

module.exports = mongoose.model("Group", Group);
