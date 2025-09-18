const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Define models
const User = sequelize.define("User", {
  userId: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  userType: {
    type: DataTypes.ENUM("FARMER", "LAB", "PROCESSOR", "CONSUMER", "ADMIN"),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

const HerbBatch = sequelize.define("HerbBatch", {
  herbId: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  species: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  collectorId: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: [],
  },
  documents: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: [],
  },
  status: {
    type: DataTypes.ENUM("COLLECTED", "TESTED", "PROCESSED", "DISTRIBUTED"),
    defaultValue: "COLLECTED",
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
});

const QRCode = sequelize.define("QRCode", {
  qrCode: {
    type: DataTypes.TEXT,
    unique: true,
    allowNull: false,
  },
  herbId: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

const BlockchainTransaction = sequelize.define("BlockchainTransaction", {
  transactionId: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  herbId: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  eventType: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILED"),
    defaultValue: "PENDING",
  },
  data: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  errorMessage: {
    type: DataTypes.TEXT,
  },
});

// Define associations
HerbBatch.hasMany(QRCode, { foreignKey: "herbId", sourceKey: "herbId" });
QRCode.belongsTo(HerbBatch, { foreignKey: "herbId", targetKey: "herbId" });

HerbBatch.hasMany(BlockchainTransaction, {
  foreignKey: "herbId",
  sourceKey: "herbId",
});
BlockchainTransaction.belongsTo(HerbBatch, {
  foreignKey: "herbId",
  targetKey: "herbId",
});

User.hasMany(HerbBatch, { foreignKey: "collectorId", sourceKey: "userId" });
HerbBatch.belongsTo(User, { foreignKey: "collectorId", targetKey: "userId" });

module.exports = {
  sequelize,
  User,
  HerbBatch,
  QRCode,
  BlockchainTransaction,
};
