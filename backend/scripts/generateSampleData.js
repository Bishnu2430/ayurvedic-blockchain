const {
  User,
  HerbBatch,
  QRCode,
  BlockchainTransaction,
  sequelize,
} = require("../models");
const bcrypt = require("bcryptjs");
const QRCodeGenerator = require("qrcode");
const { v4: uuidv4 } = require("uuid");

const sampleUsers = [
  {
    userId: "FARMER_001",
    name: "Raj Kumar",
    email: "farmer@example.com",
    userType: "FARMER",
    location: {
      state: "Kerala",
      district: "Wayanad",
      village: "Sulthan Bathery",
    },
  },
  {
    userId: "LAB_001",
    name: "Ayurveda Quality Labs",
    email: "lab@example.com",
    userType: "LAB",
    location: { state: "Kerala", district: "Kochi", area: "Ernakulam" },
  },
  {
    userId: "PROCESSOR_001",
    name: "Kerala Herbs Processing Unit",
    email: "processor@example.com",
    userType: "PROCESSOR",
    location: {
      state: "Kerala",
      district: "Thiruvananthapuram",
      area: "Technopark",
    },
  },
  {
    userId: "CONSUMER_001",
    name: "Dr. Priya Nair",
    email: "consumer@example.com",
    userType: "CONSUMER",
    location: { state: "Kerala", district: "Kochi", area: "Fort Kochi" },
  },
];

const sampleHerbs = [
  {
    species: "Ashwagandha",
    collectorId: "FARMER_001",
    location: { latitude: 11.6854, longitude: 76.132, altitude: 850 },
    quality: 4,
    notes: "Premium quality roots harvested during winter season",
  },
  {
    species: "Turmeric",
    collectorId: "FARMER_001",
    location: { latitude: 11.67, longitude: 76.12, altitude: 820 },
    quality: 5,
    notes: "Organic turmeric with high curcumin content",
  },
  {
    species: "Brahmi",
    collectorId: "FARMER_001",
    location: { latitude: 11.69, longitude: 76.14, altitude: 780 },
    quality: 4,
    notes: "Fresh brahmi leaves collected in morning",
  },
];

async function generateSampleData() {
  try {
    console.log("Starting sample data generation...");

    // Clear existing data
    await BlockchainTransaction.destroy({ where: {} });
    await QRCode.destroy({ where: {} });
    await HerbBatch.destroy({ where: {} });
    await User.destroy({ where: {} });
    console.log("Cleared existing data");

    // Create sample users
    const defaultPassword = await bcrypt.hash("password123", 12);

    for (const userData of sampleUsers) {
      await User.create({
        ...userData,
        email: userData.email,
        password: defaultPassword,
      });
    }
    console.log(`Created ${sampleUsers.length} sample users`);

    // Create sample herb batches
    for (let i = 0; i < sampleHerbs.length; i++) {
      const herbData = sampleHerbs[i];
      const herbId = `${herbData.species.substring(0, 3).toUpperCase()}${
        Date.now() + i
      }-${Math.random().toString(36).substr(2, 6)}`;
      const timestamp = new Date(
        Date.now() - i * 24 * 60 * 60 * 1000
      ).toISOString();

      const herbBatch = await HerbBatch.create({
        herbId,
        species: herbData.species,
        collectorId: herbData.collectorId,
        status: i === 0 ? "PROCESSED" : i === 1 ? "TESTED" : "COLLECTED",
        metadata: {
          notes: herbData.notes,
          collectionDate: timestamp,
          location: herbData.location,
          quality: herbData.quality,
        },
      });

      // Generate QR code
      const qrCodeData = {
        herbId,
        type: "herb_traceability",
        url: `${
          process.env.CORS_ORIGIN || "http://localhost:3000"
        }/trace/${herbId}`,
      };
      const qrCodeString = JSON.stringify(qrCodeData);

      await QRCode.create({
        qrCode: qrCodeString,
        herbId,
      });

      // Create sample blockchain transactions
      const transactionTypes = ["COLLECTION"];
      if (i <= 1) transactionTypes.push("QUALITY_TEST");
      if (i === 0) transactionTypes.push("PROCESSING");

      for (const eventType of transactionTypes) {
        await BlockchainTransaction.create({
          transactionId: uuidv4(),
          herbId,
          eventType,
          status: "SUCCESS",
          data: {
            herbId,
            timestamp: new Date(
              Date.now() -
                (transactionTypes.length -
                  transactionTypes.indexOf(eventType)) *
                  12 *
                  60 *
                  60 *
                  1000
            ).toISOString(),
            eventType,
          },
        });
      }

      console.log(`Created herb batch: ${herbId} (${herbData.species})`);
    }

    console.log("Sample data generation completed successfully");
    return {
      users: sampleUsers.length,
      herbs: sampleHerbs.length,
      message: "Sample data created successfully",
    };
  } catch (error) {
    console.error("Error generating sample data:", error);
    throw error;
  }
}

if (require.main === module) {
  generateSampleData()
    .then((result) => {
      console.log("Sample data generation result:", result);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Sample data generation failed:", error);
      process.exit(1);
    });
}

module.exports = generateSampleData;
