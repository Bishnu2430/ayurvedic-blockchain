const express = require("express");
const { body, validationResult } = require("express-validator");
const fabricService = require("../services/fabricService");
const { HerbBatch, QRCode, BlockchainTransaction } = require("../models");
const { authenticateToken, requireUserType } = require("../middleware/auth");
const QRCodeGenerator = require("qrcode");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// --------------------
// Record Collection (FARMER)
// --------------------
router.post(
  "/collect",
  authenticateToken,
  requireUserType(["FARMER"]),
  [
    body("species").trim().isLength({ min: 2 }),
    body("location").isObject(),
    body("quality").isInt({ min: 1, max: 5 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { species, location, quality, notes } = req.body;
      const collectorId = req.user.userId;

      const herbId = `${species
        .substring(0, 3)
        .toUpperCase()}${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 6)}`;
      const timestamp = new Date().toISOString();

      const herbBatch = await HerbBatch.create({
        herbId,
        species,
        collectorId,
        metadata: { notes, collectionDate: timestamp },
      });

      const blockchainData = {
        herbId,
        collectorId,
        species,
        location,
        timestamp,
        quality,
      };

      let fabricResult;
      try {
        fabricResult = await fabricService.recordCollection(blockchainData);

        await BlockchainTransaction.create({
          transactionId: fabricResult.txId || uuidv4(),
          herbId,
          eventType: "COLLECTION",
          status: "SUCCESS",
          data: blockchainData,
        });
      } catch (fabricError) {
        console.error("Fabric error:", fabricError);
        await BlockchainTransaction.create({
          transactionId: uuidv4(),
          herbId,
          eventType: "COLLECTION",
          status: "FAILED",
          data: blockchainData,
          errorMessage: fabricError.message,
        });
        return res.status(500).json({
          message: "Failed to record on blockchain",
          herbBatch,
          error: fabricError.message,
        });
      }

      const qrCodeData = {
        herbId,
        type: "herb_traceability",
        url: `${process.env.CORS_ORIGIN}/trace/${herbId}`,
      };
      const qrCodeString = JSON.stringify(qrCodeData);
      const qrCodeImage = await QRCodeGenerator.toDataURL(qrCodeString);

      await QRCode.create({ qrCode: qrCodeString, herbId });

      res.status(201).json({
        message: "Collection recorded successfully",
        herbBatch,
        fabricResult,
        qrCode: { data: qrCodeString, image: qrCodeImage },
      });
    } catch (error) {
      console.error("Collection error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// --------------------
// Add Quality Test (LAB)
// --------------------
router.post(
  "/quality-test",
  authenticateToken,
  requireUserType(["LAB"]),
  [
    body("herbId").trim().isLength({ min: 1 }),
    body("testType").trim().isLength({ min: 1 }),
    body("results").isObject(),
    body("passed").isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { herbId, testType, results, passed } = req.body;
      const labId = req.user.userId;

      const herbBatch = await HerbBatch.findOne({ where: { herbId } });
      if (!herbBatch)
        return res.status(404).json({ message: "Herb batch not found" });

      const testData = { herbId, labId, testType, results, passed };

      let fabricResult;
      try {
        fabricResult = await fabricService.addQualityTest(testData);

        await BlockchainTransaction.create({
          transactionId: fabricResult.txId || uuidv4(),
          herbId,
          eventType: "QUALITY_TEST",
          status: "SUCCESS",
          data: testData,
        });

        await herbBatch.update({
          status: passed ? "TESTED" : "FAILED",
          metadata: {
            ...herbBatch.metadata,
            lastTest: {
              testType,
              results,
              passed,
              timestamp: new Date().toISOString(),
            },
          },
        });
      } catch (fabricError) {
        console.error("Fabric error:", fabricError);
        await BlockchainTransaction.create({
          transactionId: uuidv4(),
          herbId,
          eventType: "QUALITY_TEST",
          status: "FAILED",
          data: testData,
          errorMessage: fabricError.message,
        });
        return res.status(500).json({
          message: "Failed to record quality test on blockchain",
          error: fabricError.message,
        });
      }

      res.json({ message: "Quality test recorded successfully", fabricResult });
    } catch (error) {
      console.error("Quality test error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// --------------------
// Add Processing Step (PROCESSOR)
// --------------------
router.post(
  "/process",
  authenticateToken,
  requireUserType(["PROCESSOR"]),
  [
    body("herbId").trim().isLength({ min: 1 }),
    body("stepType").trim().isLength({ min: 1 }),
    body("conditions").isObject(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { herbId, stepType, conditions } = req.body;
      const processorId = req.user.userId;

      const herbBatch = await HerbBatch.findOne({ where: { herbId } });
      if (!herbBatch)
        return res.status(404).json({ message: "Herb batch not found" });

      const processData = { herbId, processorId, stepType, conditions };

      let fabricResult;
      try {
        fabricResult = await fabricService.addProcessingStep(processData);

        await BlockchainTransaction.create({
          transactionId: fabricResult.txId || uuidv4(),
          herbId,
          eventType: "PROCESSING",
          status: "SUCCESS",
          data: processData,
        });

        await herbBatch.update({
          status: "PROCESSED",
          metadata: {
            ...herbBatch.metadata,
            lastProcessing: {
              stepType,
              conditions,
              timestamp: new Date().toISOString(),
            },
          },
        });
      } catch (fabricError) {
        console.error("Fabric error:", fabricError);
        await BlockchainTransaction.create({
          transactionId: uuidv4(),
          herbId,
          eventType: "PROCESSING",
          status: "FAILED",
          data: processData,
          errorMessage: fabricError.message,
        });
        return res.status(500).json({
          message: "Failed to record processing step on blockchain",
          error: fabricError.message,
        });
      }

      res.json({
        message: "Processing step recorded successfully",
        fabricResult,
      });
    } catch (error) {
      console.error("Processing error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// --------------------
// Get Herb Journey
// --------------------
router.get("/herb/:herbId", async (req, res) => {
  try {
    const { herbId } = req.params;

    const herbBatch = await HerbBatch.findOne({
      where: { herbId },
      include: [
        { model: QRCode, where: { herbId }, required: false },
        { model: BlockchainTransaction, where: { herbId }, required: false },
      ],
    });

    if (!herbBatch)
      return res.status(404).json({ message: "Herb batch not found" });

    let fabricJourney = [];
    try {
      fabricJourney = await fabricService.getHerbJourney(herbId);
    } catch (fabricError) {
      console.error("Error fetching fabric journey:", fabricError);
    }

    res.json({
      herbBatch,
      blockchainJourney: fabricJourney,
      qrCodes: herbBatch.QRCodes || [],
      transactions: herbBatch.BlockchainTransactions || [],
    });
  } catch (error) {
    console.error("Get journey error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------
// Trace by QR Code
// --------------------
router.post(
  "/trace",
  [body("qrCode").trim().isLength({ min: 1 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { qrCode } = req.body;

      const qrRecord = await QRCode.findOne({
        where: { qrCode, isActive: true },
        include: [{ model: HerbBatch, required: true }],
      });

      if (!qrRecord)
        return res
          .status(404)
          .json({ message: "QR code not found or inactive" });

      const herbId = qrRecord.herbId;
      let fabricJourney = [];
      try {
        fabricJourney = await fabricService.getHerbJourney(herbId);
      } catch (fabricError) {
        console.error("Error fetching fabric journey:", fabricError);
      }

      res.json({
        herbBatch: qrRecord.HerbBatch,
        blockchainJourney: fabricJourney,
        traceabilityData: {
          qrCode: qrRecord.qrCode,
          scannedAt: new Date().toISOString(),
          isAuthentic: true,
        },
      });
    } catch (error) {
      console.error("Trace error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// --------------------
// Optional: Admin endpoint to list all herb batches
// --------------------
router.get(
  "/",
  authenticateToken,
  requireUserType(["ADMIN"]),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await HerbBatch.findAndCountAll({
        include: [{ model: QRCode, required: false }],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      res.json({
        herbBatches: rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      console.error("Get herb batches error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
