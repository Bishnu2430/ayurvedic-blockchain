const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");

class FabricService {
  constructor() {
    this.gateway = null;
    this.network = null;
    this.contract = null;
    this.wallet = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      // Load connection profile
      const ccpPath = path.resolve(
        process.env.FABRIC_NETWORK_PATH,
        "organizations",
        "peerOrganizations",
        "org1.example.com",
        "connection-org1.json"
      );

      const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

      // Create wallet
      const walletPath = path.join(
        process.cwd(),
        process.env.FABRIC_WALLET_PATH
      );
      this.wallet = await Wallets.newFileSystemWallet(walletPath);

      // Check if user exists in wallet
      const identity = await this.wallet.get(process.env.FABRIC_USER);
      if (!identity) {
        throw new Error(
          `Identity ${process.env.FABRIC_USER} not found in wallet`
        );
      }

      // Create gateway
      this.gateway = new Gateway();
      await this.gateway.connect(ccp, {
        wallet: this.wallet,
        identity: process.env.FABRIC_USER,
        discovery: { enabled: true, asLocalhost: true },
      });

      // Get network and contract
      this.network = await this.gateway.getNetwork(process.env.FABRIC_CHANNEL);
      this.contract = this.network.getContract(process.env.FABRIC_CHAINCODE);

      this.isInitialized = true;
      console.log("Fabric service initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Fabric service:", error);
      throw error;
    }
  }

  async recordCollection(data) {
    if (!this.isInitialized) await this.initialize();

    try {
      const result = await this.contract.submitTransaction(
        "RecordCollection",
        data.herbId,
        data.collectorId,
        data.species,
        JSON.stringify(data.location),
        data.timestamp,
        data.quality.toString()
      );

      return JSON.parse(result.toString());
    } catch (error) {
      console.error("Error recording collection:", error);
      throw error;
    }
  }

  async addQualityTest(data) {
    if (!this.isInitialized) await this.initialize();

    try {
      const result = await this.contract.submitTransaction(
        "AddQualityTest",
        data.herbId,
        data.labId,
        data.testType,
        JSON.stringify(data.results),
        data.passed.toString()
      );

      return JSON.parse(result.toString());
    } catch (error) {
      console.error("Error adding quality test:", error);
      throw error;
    }
  }

  async addProcessingStep(data) {
    if (!this.isInitialized) await this.initialize();

    try {
      const result = await this.contract.submitTransaction(
        "AddProcessingStep",
        data.herbId,
        data.processorId,
        data.stepType,
        JSON.stringify(data.conditions)
      );

      return JSON.parse(result.toString());
    } catch (error) {
      console.error("Error adding processing step:", error);
      throw error;
    }
  }

  async getHerbJourney(herbId) {
    if (!this.isInitialized) await this.initialize();

    try {
      const result = await this.contract.evaluateTransaction(
        "GetHerbJourney",
        herbId
      );
      return JSON.parse(result.toString());
    } catch (error) {
      console.error("Error getting herb journey:", error);
      throw error;
    }
  }

  async disconnect() {
    if (this.gateway) {
      await this.gateway.disconnect();
    }
  }
}

module.exports = new FabricService();
