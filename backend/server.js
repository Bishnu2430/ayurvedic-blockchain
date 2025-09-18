const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const { sequelize } = require("./models");
const fabricService = require("./services/fabricService");

// Import routes
const authRoutes = require("./routes/auth");
const fabricRoutes = require("./routes/fabric");

const herbRoutes = require("./routes/herbs");
const userRoutes = require("./routes/users");
const generateSampleData = require("./scripts/generateSampleData");
const setupWallet = require("./scripts/setupWallet");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/fabric", fabricRoutes);

app.use("/api/herbs", herbRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    fabric: fabricService.isInitialized,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.post("/api/demo/setup", async (req, res) => {
  try {
    if (process.env.DEMO_MODE !== "true") {
      return res.status(403).json({ message: "Demo mode not enabled" });
    }

    // Setup wallet first
    await setupWallet();

    // Generate sample data
    const result = await generateSampleData();

    res.json({
      message: "Demo setup completed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Demo setup error:", error);
    res.status(500).json({
      message: "Demo setup failed",
      error: error.message,
    });
  }
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("Database connection established");

    // Sync database models
    await sequelize.sync({ alter: true });
    console.log("Database synchronized");

    // Initialize Fabric service
    try {
      await fabricService.initialize();
      console.log("Fabric service initialized");
    } catch (fabricError) {
      console.warn("Fabric initialization failed:", fabricError.message);
      console.warn("Server will continue without blockchain functionality");
    }

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`CORS origin: ${process.env.CORS_ORIGIN}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, shutting down gracefully");
  await fabricService.disconnect();
  await sequelize.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("Received SIGINT, shutting down gracefully");
  await fabricService.disconnect();
  await sequelize.close();
  process.exit(0);
});

startServer();
