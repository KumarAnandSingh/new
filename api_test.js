const axios = require('axios');

/**
 * API endpoint testing script
 * Tests the Studify.in backend API endpoints
 */
async function testApiEndpoints() {
  console.log('Starting API endpoint tests...');
  
  // Base URL for API
  const baseUrl = 'http://localhost:5000/api';
  
  // Test results tracking
  const results = {
    passed: 0,
    failed: 0,
    total: 0
  };
  
  // Helper function to run a test
  async function runTest(name, testFn) {
    results.total++;
    try {
      console.log(`\nTesting: ${name}`);
      await testFn();
      console.log(`✓ Passed: ${name}`);
      results.passed++;
    } catch (error) {
      console.error(`✗ Failed: ${name}`);
      console.error(`  Error: ${error.message}`);
      if (error.response) {
        console.error(`  Status: ${error.response.status}`);
        console.error(`  Data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
      results.failed++;
    }
  }
  
  // Test user endpoints
  await runTest('GET /users - Get all users', async () => {
    const response = await axios.get(`${baseUrl}/users`);
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Expected array of users');
    }
  });
  
  await runTest('GET /users/:id - Get user by ID', async () => {
    // Assuming user ID 1 exists
    const response = await axios.get(`${baseUrl}/users/1`);
    if (!response.data || !response.data.id) {
      throw new Error('Expected user object with ID');
    }
  });
  
  // Test tools endpoints
  await runTest('GET /tools - Get all tools', async () => {
    const response = await axios.get(`${baseUrl}/tools`);
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Expected array of tools');
    }
  });
  
  await runTest('GET /tools/:id - Get tool by ID', async () => {
    // Assuming tool ID 1 exists
    const response = await axios.get(`${baseUrl}/tools/1`);
    if (!response.data || !response.data.id) {
      throw new Error('Expected tool object with ID');
    }
  });
  
  await runTest('GET /tools/category/:category - Get tools by category', async () => {
    const response = await axios.get(`${baseUrl}/tools/category/AI Writing`);
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Expected array of tools');
    }
  });
  
  // Test tutorials endpoints
  await runTest('GET /tutorials - Get all tutorials', async () => {
    const response = await axios.get(`${baseUrl}/tutorials`);
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Expected array of tutorials');
    }
  });
  
  await runTest('GET /tutorials/:id - Get tutorial by ID', async () => {
    // Assuming tutorial ID 1 exists
    const response = await axios.get(`${baseUrl}/tutorials/1`);
    if (!response.data || !response.data.id) {
      throw new Error('Expected tutorial object with ID');
    }
  });
  
  // Test productivity endpoints
  await runTest('GET /productivity - Get all productivity hacks', async () => {
    const response = await axios.get(`${baseUrl}/productivity`);
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Expected array of productivity hacks');
    }
  });
  
  await runTest('GET /productivity/:id - Get productivity hack by ID', async () => {
    // Assuming productivity hack ID 1 exists
    const response = await axios.get(`${baseUrl}/productivity/1`);
    if (!response.data || !response.data.id) {
      throw new Error('Expected productivity hack object with ID');
    }
  });
  
  // Test search endpoint
  await runTest('GET /search?q=:query - Search across content', async () => {
    const response = await axios.get(`${baseUrl}/search?q=AI`);
    if (!response.data || !response.data.results || !Array.isArray(response.data.results)) {
      throw new Error('Expected search results object with results array');
    }
  });
  
  // Print summary
  console.log('\n=== API Test Summary ===');
  console.log(`Total tests: ${results.total}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Success rate: ${Math.round((results.passed / results.total) * 100)}%`);
}

// Run the tests
testApiEndpoints().catch(console.error);
