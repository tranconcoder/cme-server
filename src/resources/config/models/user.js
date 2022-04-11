const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
	{
		googleId: { type: "string", required: true },
		googleName: { type: "string", required: true },
		name: { type: "string", default: "" },
		email: { type: "string", required: true },
		avatar: { type: "string", required: true },
	},
	{
		timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
	}
);

module.exports = mongoose.model("User", User);
