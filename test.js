const axios = require("axios");

const baseUrl = "http://localhost:5000/api";
let token = "";      // For normal user
let adminToken = ""; // For admin user
let sweetId = null;  // Will hold the sweet ID for CRUD tests

// Helper function for logging
function log(title, data) {
  console.log(`\n=== ${title} ===`);
  console.log(data);
}

// Main async function
(async () => {
  try {
    // -------------------
    // 1. Register User
    // -------------------
    const registerResp = await axios.post(`${baseUrl}/auth/register`, {
      username: "testuser",
      email: "testuser@example.com",
      password: "Test123!"
    });
    token = registerResp.data.token;
    log("Register User", registerResp.data);

    // -------------------
    // 2. Login User
    // -------------------
    const loginResp = await axios.post(`${baseUrl}/auth/login`, {
      email: "testuser@example.com",
      password: "Test123!"
    });
    token = loginResp.data.token;
    log("Login User", loginResp.data);

    // -------------------
    // 3. Register Admin (optional)
    // -------------------
    const adminLogin = await axios.post(`${baseUrl}/auth/login`, {
      email: "alice@example.com",
      password: "MyS3cret!"
    });
    adminToken = adminLogin.data.token;

    // -------------------
    // 4. Add Sweet
    // -------------------
    const addSweetResp = await axios.post(`${baseUrl}/sweets`, {
      name: "Chocolate Cake",
      category: "Cake",
      price: 25.5,
      quantity: 10
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    sweetId = addSweetResp.data.id;
    log("Add Sweet", addSweetResp.data);

    // -------------------
    // 5. Get All Sweets
    // -------------------
    const getSweetsResp = await axios.get(`${baseUrl}/sweets`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    log("Get All Sweets", getSweetsResp.data);

    // -------------------
    // 6. Search Sweets
    // -------------------
    const searchResp = await axios.get(`${baseUrl}/sweets/search?name=Chocolate`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    log("Search Sweets", searchResp.data);

    // -------------------
    // 7. Update Sweet
    // -------------------
    const updateResp = await axios.put(`${baseUrl}/sweets/${sweetId}`, {
      price: 30.0,
      quantity: 15
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    log("Update Sweet", updateResp.data);

    // -------------------
    // 8. Purchase Sweet
    // -------------------
    const purchaseResp = await axios.post(`${baseUrl}/sweets/${sweetId}/purchase`, {
      quantity: 5
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    log("Purchase Sweet", purchaseResp.data);

    // -------------------
    // 9. Restock Sweet (Admin Only)
    // -------------------
    const restockResp = await axios.post(`${baseUrl}/sweets/${sweetId}/restock`, {
      quantity: 10
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    log("Restock Sweet", restockResp.data);

    // -------------------
    // 10. Delete Sweet (Admin Only)
    // -------------------
    const deleteResp = await axios.delete(`${baseUrl}/sweets/${sweetId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    log("Delete Sweet", deleteResp.data);

    console.log("\n✅ All tests completed successfully!");
  } catch (err) {
    if (err.response) {
      console.error("\n❌ Error:", err.response.status, err.response.data);
    } else {
      console.error("\n❌ Error:", err.message);
    }
  }
})();
