const { BlockchainTransaction } = require("./models");
const { v4: uuidv4 } = require("uuid");

async function testBlockchainTransaction() {
  try {
    const tx = await BlockchainTransaction.create({
      transactionId: uuidv4(),
      herbId: "ASH1758202125157-ciyjeo",
      eventType: "TEST_EVENT",
      status: "SUCCESS",
      data: { message: "Test transaction logged successfully" },
    });
    console.log("Blockchain transaction created:", tx.toJSON());
  } catch (err) {
    console.error("Blockchain transaction test failed:", err);
  }
}

testBlockchainTransaction();
