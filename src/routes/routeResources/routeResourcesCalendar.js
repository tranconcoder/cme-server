const express = require("express");
const router = express.Router();

const { verifyAccessToken } = require("../../middleware/tokenMethods");
const calendarController = require("../../controllers/ctrlerCalendar");

router.post("/create", verifyAccessToken, calendarController.create);
router.get("/get-all", verifyAccessToken, calendarController.getAll);
router.patch("/update", verifyAccessToken, calendarController.update);
router.delete("/delete", verifyAccessToken, calendarController.delete);

module.exports = router;
