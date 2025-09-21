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

// Gemini API client
const { GoogleGenerativeAI } = require("@google/generative-ai");

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

// Gemini route
app.post("/api/gemini/ask", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json({ response: responseText });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ message: "Failed to get response from Gemini" });
  }
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

// Demo setup route
app.post("/api/demo/setup", async (req, res) => {
  try {
    if (process.env.DEMO_MODE !== "true") {
      return res.status(403).json({ message: "Demo mode not enabled" });
    }

    await setupWallet();
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
    await sequelize.authenticate();
    console.log("Database connection established");

    await sequelize.sync({ alter: true });
    console.log("Database synchronized");

    try {
      await fabricService.initialize();
      console.log("Fabric service initialized");
    } catch (fabricError) {
      console.warn("Fabric initialization failed:", fabricError.message);
      console.warn("Server will continue without blockchain functionality");
    }

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
