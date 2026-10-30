const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const {
  registerForWorkshop,
  listRegistrations,
  unregisterFromWorkshop,
} = require("../controllers/registrationController");

router.post("/", verifyToken, requireRole("participant"), registerForWorkshop);
router.get("/", verifyToken, listRegistrations); // handled for participants (can list only their own reg) in the controller
router.put(
  "/:registrationId/unregister",
  verifyToken,
  requireRole("participant"),
  unregisterFromWorkshop,
);

module.exports = router;
