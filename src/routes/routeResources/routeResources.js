const express = require("express");
const router = express.Router();

const routeResourcesClassInfo = require("./routeResourcesClassInfo");
const routeResourcesAttendance = require("./routeResourcesAttendance");
const routeResourcesCalendar = require("./routeResourcesCalendar");

router.use("/class-info", routeResourcesClassInfo);
router.use("/attendance-history", routeResourcesAttendance);
router.use("/calendar", routeResourcesCalendar);

module.exports = router;
