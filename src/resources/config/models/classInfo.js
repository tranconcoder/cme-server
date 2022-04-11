const { v4: uuidV4 } = require("uuid");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassInfo = new Schema(
	{
		googleId: { type: String, required: true },
		classInfoName: { type: String, default: true },
		studentList: {
			type: Array,
			default: [],
		},
		acceptNewRequest: { type: Boolean, default: false },
		onlineFormUrl: {
			type: String,
			default: function () {
				return `/resources/class-info/add-student-form/${this.googleId}/${this._id}`;
			},
		},
		onlineFormPassword: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
	}
);

module.exports = mongoose.model("ClassInfo", ClassInfo);
