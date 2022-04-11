const mongoose = require("mongoose");
const { Schema } = mongoose;

const Token = new Schema(
	{
		uuid: { type: String, required: true },
		ownerGoogleId: {
			type: String,
			required: true,
		},
		refreshToken: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Date,
			expires: 3 * 60 * 60, // Expire after 3 hours
			default: Date.now,
		},
	},
	{
		timestamps: { updatedAt: "updatedAt" },
	}
);

module.exports = mongoose.model("Token", Token);
