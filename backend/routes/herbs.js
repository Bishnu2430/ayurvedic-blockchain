const express = require("express");
const { body, validationResult } = require("express-validator");
const { HerbBatch, QRCode, BlockchainTransaction, User } = require("../models");
const { authenticateToken, requireUserType } = require("../middleware/auth");
const { Op, fn, col } = require("sequelize");

const router = express.Router();

// --------------------
// Get all herbs (with pagination, optional filters)
// --------------------
router.get("/", authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status;
    const species = req.query.species;

    const where = {};
    if (status) where.status = status;
    if (species) where.species = { [Op.iLike]: `%${species}%` };

    const { count, rows } = await HerbBatch.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ["userId", "name", "userType"],
          required: false,
        },
        { model: QRCode, required: false },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      herbs: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Get herbs error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------
// Get herbs belonging to current user
// --------------------
router.get("/my-herbs", authenticateToken, async (req, res) => {
  try {
    const herbs = await HerbBatch.findAll({
      where: { collectorId: req.user.userId },
      include: [
        { model: QRCode, required: false },
        {
          model: BlockchainTransaction,
          required: false,
          order: [["createdAt", "DESC"]],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ herbs });
  } catch (error) {
    console.error("Get my herbs error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------
// Get herb statistics (admin only)
// --------------------
router.get(
  "/stats",
  authenticateToken,
  requireUserType(["ADMIN"]),
  async (req, res) => {
    try {
      const totalHerbs = await HerbBatch.count();
      const collectedCount = await HerbBatch.count({
        where: { status: "COLLECTED" },
      });
      const testedCount = await HerbBatch.count({
        where: { status: "TESTED" },
      });
      const processedCount = await HerbBatch.count({
        where: { status: "PROCESSED" },
      });

      const speciesStats = await HerbBatch.findAll({
        attributes: ["species", [fn("COUNT", col("species")), "count"]],
        group: ["species"],
      });

      const recentTransactions = await BlockchainTransaction.findAll({
        limit: 10,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: HerbBatch,
            attributes: ["herbId", "species"],
            required: true,
          },
        ],
      });

      res.json({
        totalHerbs,
        statusBreakdown: {
          collected: collectedCount,
          tested: testedCount,
          processed: processedCount,
        },
        speciesStats: speciesStats.map((item) => ({
          species: item.species,
          count: parseInt(item.getDataValue("count")),
        })),
        recentTransactions,
      });
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// --------------------
// Search herbs by ID or species
// --------------------
router.get("/search", authenticateToken, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res
        .status(400)
        .json({ message: "Search query must be at least 2 characters" });
    }

    const herbs = await HerbBatch.findAll({
      where: {
        [Op.or]: [
          { herbId: { [Op.iLike]: `%${q}%` } },
          { species: { [Op.iLike]: `%${q}%` } },
        ],
      },
      include: [
        {
          model: User,
          attributes: ["userId", "name", "userType"],
          required: false,
        },
      ],
      limit: 20,
      order: [["createdAt", "DESC"]],
    });

    res.json({ herbs, query: q });
  } catch (error) {
    console.error("Search herbs error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------
// Update herb metadata
// --------------------
router.put(
  "/:herbId/metadata",
  authenticateToken,
  [body("metadata").isObject()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { herbId } = req.params;
      const { metadata } = req.body;

      const herbBatch = await HerbBatch.findOne({ where: { herbId } });
      if (!herbBatch)
        return res.status(404).json({ message: "Herb batch not found" });

      // Only collector or admin can update metadata
      if (
        herbBatch.collectorId !== req.user.userId &&
        req.user.userType !== "ADMIN"
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this herb" });
      }

      await herbBatch.update({
        metadata: { ...herbBatch.metadata, ...metadata },
      });

      res.json({ message: "Metadata updated successfully", herbBatch });
    } catch (error) {
      console.error("Update metadata error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
