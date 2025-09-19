const { Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const fs = require("fs");

async function setupWallet() {
  try {
    // Create wallet
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Load connection profile
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "fabric-samples",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create CA client
    const caInfo = ccp.certificateAuthorities["ca.org1.example.com"];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: false },
      caInfo.caName
    );

    // ----------------------------
    // Enroll admin if not in wallet
    // ----------------------------
    const adminIdentity = await wallet.get("admin");
    if (!adminIdentity) {
      console.log("Admin identity not found in wallet, enrolling admin...");

      const enrollment = await ca.enroll({
        enrollmentID: "admin",
        enrollmentSecret: "adminpw",
      });

      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: "Org1MSP",
        type: "X.509",
      };
      await wallet.put("admin", x509Identity);
      console.log("Successfully enrolled admin user and imported to wallet");
    }

    // ----------------------------
    // Enroll or register appUser
    // ----------------------------
    let userIdentity = await wallet.get("appUser");
    if (!userIdentity) {
      console.log(
        "App user identity not found in wallet, setting up appUser..."
      );

      // Get admin identity from wallet
      const adminIdentity = await wallet.get("admin");
      const provider = wallet
        .getProviderRegistry()
        .getProvider(adminIdentity.type);
      const adminUser = await provider.getUserContext(adminIdentity, "admin");

      let secret;
      try {
        // Try to register appUser (may fail if already registered)
        secret = await ca.register(
          {
            affiliation: "org1.department1",
            enrollmentID: "appUser",
            role: "client",
          },
          adminUser
        );
        console.log("Successfully registered appUser with CA");
      } catch (registerError) {
        if (registerError.toString().includes("already registered")) {
          console.log("appUser already registered, skipping registration");
          // Use default secret (change if you used a custom one originally)
          secret = "appUserpw";
        } else {
          throw registerError;
        }
      }

      // Enroll appUser
      const enrollment = await ca.enroll({
        enrollmentID: "appUser",
        enrollmentSecret: secret,
      });

      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: "Org1MSP",
        type: "X.509",
      };
      await wallet.put("appUser", x509Identity);
      console.log("Successfully enrolled appUser and imported to wallet");
    }

    console.log("Wallet setup completed successfully");
  } catch (error) {
    console.error("Failed to set up wallet:", error);
    throw error;
  }
}

// Run as script
if (require.main === module) {
  setupWallet()
    .then(() => {
      console.log("Wallet setup script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Wallet setup script failed:", error);
      process.exit(1);
    });
}

module.exports = setupWallet;
