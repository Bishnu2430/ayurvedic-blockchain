const express = require("express");
const { body, validationResult } = require("express-validator");
const { User } = require("../models");
const { authenticateToken, requireUserType } = require("../middleware/auth");
const router = express.Router();

// Get current user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { userId: req.user.userId },
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update current user profile
router.put(
  "/profile",
  authenticateToken,
  [
    body("name").optional().trim().isLength({ min: 2 }),
    body("location").optional().isObject(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { name, location } = req.body;
      const updateData = {};
      if (name) updateData.name = name;
      if (location) updateData.location = location;

      await User.update(updateData, { where: { userId: req.user.userId } });

      const updatedUser = await User.findOne({
        where: { userId: req.user.userId },
        attributes: { exclude: ["password"] },
      });

      res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get all users (admin only) with optional filtering
router.get(
  "/",
  authenticateToken,
  requireUserType(["ADMIN"]),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const userType = req.query.userType;

      const where = {};
      if (userType) where.userType = userType;

      const { count, rows } = await User.findAndCountAll({
        where,
        attributes: { exclude: ["password"] },
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      res.json({
        users: rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get single user by ID (admin only)
router.get(
  "/:userId",
  authenticateToken,
  requireUserType(["ADMIN"]),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findOne({
        where: { userId },
        attributes: { exclude: ["password"] },
      });
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ user });
    } catch (error) {
      console.error("Get user by ID error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Toggle user active status (admin only)
router.put(
  "/:userId/status",
  authenticateToken,
  requireUserType(["ADMIN"]),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;

      const user = await User.findOne({ where: { userId } });
      if (!user) return res.status(404).json({ message: "User not found" });

      await user.update({ isActive: Boolean(isActive) });

      res.json({
        message: `User ${isActive ? "activated" : "deactivated"} successfully`,
        user: {
          userId: user.userId,
          name: user.name,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      console.error("Update user status error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
