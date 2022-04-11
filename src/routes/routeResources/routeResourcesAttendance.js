const express = require("express");
const router = express.Router();

const { tokenMethods } = require("../../middleware/index");
const attendanceController = require("../../controllers/ctrlerAttendance");

router.get("/get-all", tokenMethods.verifyAccessToken, attendanceController.getAll);
router.post("/add", tokenMethods.verifyAccessToken, attendanceController.add);
router.delete("/delete", tokenMethods.verifyAccessToken, attendanceController.delete);

module.exports = router;
