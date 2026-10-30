const express = require("express");
const router = express.Router();
const {
  addMaterial,
  listMaterials,
} = require("../controllers/materialController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.post(
  "/",
  verifyToken,
  requireRole(["admin", "instructor"]),
  addMaterial,
);
router.get("/", verifyToken, listMaterials);

module.exports = router;
