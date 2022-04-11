const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentInfo = new Schema({
	introduceId: { type: "string", length: 24, required: true },
	name: { type: "string", required: true },
	class: { type: "string", required: true },
	index: {
		type: "number",
		min: 0,
		max: 999,
		required: true,
	},
	group: { type: "number", min: 1, max: 10, required: true },
	meetName: { type: "string", required: true },
	gmail: { type: "string", required: true },
});

module.exports = mongoose.model("InfoStudent", StudentInfo);
