const axios = require("axios");

const BASE_URL = "http://localhost:3001/api";

async function testEndpoints() {
  try {
    console.log("Testing backend endpoints...");

    // Test health check
    const health = await axios.get("http://localhost:3001/health");
    console.log("✓ Health check:", health.data.status);

    // Test registration
    const registerData = {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
      userType: "FARMER",
      location: { state: "Kerala", district: "Test" },
    };

    try {
      const registerResponse = await axios.post(
        `${BASE_URL}/auth/register`,
        registerData
      );
      console.log("✓ Registration successful");

      // Test login
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: registerData.email,
        password: registerData.password,
      });

      const token = loginResponse.data.token;
      console.log("✓ Login successful");

      // Test authenticated endpoint
      const profileResponse = await axios.get(`${BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✓ Profile fetch successful");

      console.log("\nAll basic endpoints working correctly!");
    } catch (regError) {
      if (
        regError.response?.status === 400 &&
        regError.response.data.message === "User already exists"
      ) {
        console.log("✓ Registration validation working (user exists)");

        // Test login with existing user
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
          email: "farmer@example.com",
          password: "password123",
        });
        console.log("✓ Login with sample user successful");
      } else {
        throw regError;
      }
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

if (require.main === module) {
  testEndpoints();
}

module.exports = testEndpoints;
