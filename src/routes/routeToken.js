const express = require("express");
const router = express.Router();

const ctrlerToken = require("../controllers/ctrlerToken");

router.get("/get-new-access-token", ctrlerToken.getNewAccessToken);
router.get("/get-new-refresh-token", ctrlerToken.updateRefreshToken);
router.post("/verify", ctrlerToken.verifyToken);

module.exports = router;
