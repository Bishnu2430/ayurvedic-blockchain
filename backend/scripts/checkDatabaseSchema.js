// backend/scripts/checkDatabaseSchema.js
const {
  sequelize,
  User,
  HerbBatch,
  QRCode,
  BlockchainTransaction,
} = require("../models");
const { QueryTypes } = require("sequelize");

async function checkDatabaseSchema() {
  try {
    console.log("=== DATABASE SCHEMA VERIFICATION ===\n");

    // 1. Test database connection
    console.log("1. Testing database connection...");
    await sequelize.authenticate();
    console.log("✅ Database connection successful\n");

    // 2. Check if all tables exist
    console.log("2. Checking table existence...");
    const tables = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name",
      { type: QueryTypes.SELECT }
    );

    const existingTableNames = tables.map((t) => t.table_name).filter((n) => n);

    console.log("Existing tables:");
    existingTableNames.forEach((name) => console.log(`  - ${name}`));

    const expectedTables = [
      "Users",
      "HerbBatches",
      "QRCodes",
      "BlockchainTransactions",
    ];
    expectedTables.forEach((expected) => {
      const exists = existingTableNames.some(
        (existing) => existing.toLowerCase() === expected.toLowerCase()
      );
      console.log(`${exists ? "✅" : "❌"} ${expected}`);
    });
    console.log();

    // 3. Check table schemas in detail
    const tableChecks = [
      { name: "Users", display: "--- USERS TABLE ---" },
      { name: "HerbBatches", display: "--- HERB BATCHES TABLE ---" },
      { name: "QRCodes", display: "--- QR CODES TABLE ---" },
      {
        name: "BlockchainTransactions",
        display: "--- BLOCKCHAIN TRANSACTIONS TABLE ---",
      },
    ];

    for (const table of tableChecks) {
      console.log(`\n${table.display}`);
      const schema = await sequelize.query(
        `
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = '${
                  table.name
                }' OR table_name = '${table.name.toLowerCase()}'
                ORDER BY ordinal_position
            `,
        { type: QueryTypes.SELECT }
      );

      if (schema.length > 0) {
        console.table(schema);
      } else {
        console.log(`❌ ${table.name} table not found`);
      }
    }

    // 4. Check indexes
    console.log("\n4. Checking indexes...");
    const indexes = await sequelize.query(
      `
            SELECT 
                schemaname,
                tablename,
                indexname,
                indexdef
            FROM pg_indexes 
            WHERE schemaname = 'public'
            AND tablename IN ('Users','users','HerbBatches','herb_batches','QRCodes','qr_codes','BlockchainTransactions','blockchain_transactions')
            ORDER BY tablename, indexname
        `,
      { type: QueryTypes.SELECT }
    );
    console.table(indexes);

    // 5. Check foreign key constraints
    console.log("\n5. Checking foreign key constraints...");
    const foreignKeys = await sequelize.query(
      `
            SELECT
                tc.table_name,
                kcu.column_name,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name,
                tc.constraint_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
                ON tc.constraint_name = kcu.constraint_name
                AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
                ON ccu.constraint_name = tc.constraint_name
                AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_schema = 'public'
        `,
      { type: QueryTypes.SELECT }
    );

    if (foreignKeys.length > 0) {
      console.table(foreignKeys);
    } else {
      console.log("No foreign key constraints found");
    }

    // 6. Check data counts
    console.log("\n6. Data counts in each table:");

    const models = [
      { name: "Users", model: User },
      { name: "HerbBatches", model: HerbBatch },
      { name: "QRCodes", model: QRCode },
      { name: "BlockchainTransactions", model: BlockchainTransaction },
    ];

    for (const item of models) {
      try {
        const count = await item.model.count();
        console.log(`${item.name}: ${count} records`);
      } catch (error) {
        console.log(`${item.name}: Error counting - ${error.message}`);
      }
    }

    // 7. Test model associations
    console.log("\n7. Testing model associations...");
    try {
      const herbWithQR = await HerbBatch.findOne({
        include: [
          { model: QRCode, required: false },
          { model: BlockchainTransaction, required: false },
        ],
      });

      if (herbWithQR) {
        console.log("✅ HerbBatch associations working");
        console.log(
          `Sample herb: ${herbWithQR.herbId} has ${
            herbWithQR.QRCodes?.length || 0
          } QR codes and ${
            herbWithQR.BlockchainTransactions?.length || 0
          } transactions`
        );
      } else {
        console.log("⚠️  No herb batches found to test associations");
      }
    } catch (error) {
      console.log(`❌ Association test failed: ${error.message}`);
    }

    // 8. Check enum/check constraints (fixed for PostgreSQL 12+)
    console.log("\n8. Checking enum/check constraints...");
    const enumConstraints = await sequelize.query(
      `
            SELECT 
                pgc.conname as constraint_name,
                pg_get_constraintdef(pgc.oid) as constraint_definition
            FROM pg_constraint pgc
            JOIN pg_class pgcl ON pgc.conrelid = pgcl.oid
            JOIN pg_namespace nsp ON pgcl.relnamespace = nsp.oid
            WHERE nsp.nspname = 'public'
            AND pgc.contype = 'c'
            ORDER BY pgcl.relname, pgc.conname
        `,
      { type: QueryTypes.SELECT }
    );
    if (enumConstraints.length > 0) {
      console.table(enumConstraints);
    } else {
      console.log("No check constraints found");
    }

    // 9. Sample data preview
    console.log("\n9. Sample data preview:");
    try {
      const sampleUsers = await User.findAll({ limit: 3 });
      if (sampleUsers.length > 0)
        console.table(sampleUsers.map((u) => u.toJSON()));
    } catch (error) {
      console.log(`Error fetching sample users: ${error.message}`);
    }

    try {
      const sampleHerbs = await HerbBatch.findAll({ limit: 3 });
      if (sampleHerbs.length > 0)
        console.table(sampleHerbs.map((h) => h.toJSON()));
    } catch (error) {
      console.log(`Error fetching sample herbs: ${error.message}`);
    }

    console.log("\n=== SCHEMA VERIFICATION COMPLETE ===");

    // Summary
    console.log("\n=== SUMMARY ===");
    console.log("✅ Database connection: Working");
    console.log(`✅ Tables found: ${existingTableNames.length}`);
    console.log(`✅ Indexes found: ${indexes.length}`);
    console.log(`✅ Foreign keys: ${foreignKeys.length}`);
    console.log(`✅ Check constraints: ${enumConstraints.length}`);

    return {
      connected: true,
      tablesCount: existingTableNames.length,
      indexesCount: indexes.length,
      foreignKeysCount: foreignKeys.length,
      constraintsCount: enumConstraints.length,
    };
  } catch (error) {
    console.error("❌ Schema verification failed:", error.message);
    console.error("Full error:", error);
    return { connected: false, error: error.message };
  }
}

// Run directly
if (require.main === module) {
  checkDatabaseSchema()
    .then((result) => {
      console.log("\nSchema check completed with result:", result);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Schema check failed:", error);
      process.exit(1);
    });
}

module.exports = checkDatabaseSchema;
