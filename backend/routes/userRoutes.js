const express = require("express");
const router = express.Router();

const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const { getMyProfile, getAllUsers } = require("../controllers/userController");

router.get("/me", verifyToken, getMyProfile);
router.get("/", verifyToken, requireRole("admin"), getAllUsers);

module.exports = router;
