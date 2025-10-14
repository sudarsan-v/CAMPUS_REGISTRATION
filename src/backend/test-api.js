// Test script to check API Gateway connectivity
const axios = require('axios');

const API_BASE_URL = 'https://j0x67zhvpb.execute-api.us-east-2.amazonaws.com/dev';

async function testAPIs() {
  console.log('Testing API Gateway connectivity...\n');
  
  // Test 1: Root endpoint
  try {
    console.log('1. Testing root endpoint...');
    const response = await axios.get(`${API_BASE_URL}/`);
    console.log('✓ Root endpoint working:', response.status);
  } catch (error) {
    console.log('✗ Root endpoint failed:', error.response?.status, error.response?.statusText);
    console.log('Error details:', error.response?.data);
  }
  
  // Test 2: Test endpoint
  try {
    console.log('\n2. Testing /test endpoint...');
    const response = await axios.get(`${API_BASE_URL}/test`);
    console.log('✓ Test endpoint working:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    console.log('✗ Test endpoint failed:', error.response?.status, error.response?.statusText);
    console.log('Error details:', error.response?.data);
  }
  
  // Test 3: Institute test endpoint
  try {
    console.log('\n3. Testing /institute/test endpoint...');
    const response = await axios.get(`${API_BASE_URL}/institute/test`);
    console.log('✓ Institute test endpoint working:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    console.log('✗ Institute test endpoint failed:', error.response?.status, error.response?.statusText);
    console.log('Error details:', error.response?.data);
  }
  
  // Test 4: Packages endpoint
  try {
    console.log('\n4. Testing /institute/packages endpoint...');
    const response = await axios.get(`${API_BASE_URL}/institute/packages`);
    console.log('✓ Packages endpoint working:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    console.log('✗ Packages endpoint failed:', error.response?.status, error.response?.statusText);
    console.log('Error details:', error.response?.data);
  }
  
  // Test 5: Tests endpoint (the problematic one)
  try {
    console.log('\n5. Testing /institute/packages/3/tests endpoint...');
    const response = await axios.get(`${API_BASE_URL}/institute/packages/3/tests`);
    console.log('✓ Tests endpoint working:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    console.log('✗ Tests endpoint failed:', error.response?.status, error.response?.statusText);
    console.log('Error details:', error.response?.data);
    console.log('Full error:', error.message);
  }
  
  // Test 5b: Alternative tests endpoint
  try {
    console.log('\n5b. Testing alternative /institute/tests?package_id=3 endpoint...');
    const response = await axios.get(`${API_BASE_URL}/institute/tests?package_id=3`);
    console.log('✓ Alternative tests endpoint working:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    console.log('✗ Alternative tests endpoint failed:', error.response?.status, error.response?.statusText);
    console.log('Error details:', error.response?.data);
    console.log('Full error:', error.message);
  }
  
  // Test 5c: Workaround using packages endpoint with query parameters
  try {
    console.log('\n5c. Testing workaround /institute/packages?package_id=3&tests=true endpoint...');
    const response = await axios.get(`${API_BASE_URL}/institute/packages?package_id=3&tests=true`);
    console.log('✓ Workaround tests endpoint working:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    console.log('✗ Workaround tests endpoint failed:', error.response?.status, error.response?.statusText);
    console.log('Error details:', error.response?.data);
    console.log('Full error:', error.message);
  }
  
  // Test 6: Check specific OPTIONS request
  try {
    console.log('\n6. Testing OPTIONS request for tests endpoint...');
    const response = await axios.options(`${API_BASE_URL}/institute/packages/3/tests`);
    console.log('✓ OPTIONS request working:', response.status);
    console.log('CORS headers:', response.headers);
  } catch (error) {
    console.log('✗ OPTIONS request failed:', error.response?.status, error.response?.statusText);
    console.log('Error details:', error.response?.data);
  }
}

testAPIs().catch(console.error);
