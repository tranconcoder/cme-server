const express = require("express");
const router = express.Router();
const manager = require("../resources/config/models/manager");
const studentInfoDb = require("../resources/config/models/studentInfo");

// Create new userId
router.get("/create", (req, res, next) => {
	manager
		.create({})
		.then((newManagerInfo) => {
			res.json(newManagerInfo);
		})
		.catch((err) => {
			res.json(err);
		});
});

// Update last online time
router.patch("/join/:managerId", (req, res, next) => {
	const managerId = req.params.managerId;

	manager
		.updateOne({ _id: managerId }, { lastOnlineAt: Date.now() })
		.then((newManagerInfo) => {
			res.json({ success: true, newManagerInfo });
		})
		.catch((errors) => {
			res.json({ success: false, err });
		});
});

// Get all students list
router.get("/get-all-students/:managerId", (req, res, next) => {
	const managerId = req.params.managerId;

	studentInfoDb
		.find({ introduceId: managerId })
		.then((allStudentList) => {
			res.json(allStudentList);
		})
		.catch((err) => {
			res.json(err);
		});
});

module.exports = router;
