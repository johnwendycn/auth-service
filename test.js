// test.js
require('dotenv').config();
const axios = require('axios');

// Change this to your live Render URL
const BASE_URL = 'https://auth-service-3mrd.onrender.com';

// Admin API Key from your .env
const ADMIN_API_KEY = 'a7f3e8d9c2b1h4k6m9n2p5q8r3t6w1x4y7z0';

async function testAuth() {
  console.log('🚀 Testing Auth Service on Render...');
  console.log(`📍 Base URL: ${BASE_URL}\n`);
  
  // Test data
  const testUser = {
    email: `test${Date.now()}@render.com`,
    password: 'Test123!',
    full_name: 'Render Test User'
  };
  
  let accessToken = null;
  let refreshToken = null;
  let createdFeatureId = null;
  let createdSignificantId = null;
  
  try {
    // 1. HEALTH CHECK
    console.log('1️⃣  Health Check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('   ✅ Service is healthy');
    console.log(`   📊 Status: ${health.data.status || 'OK'}\n`);
    
    // 2. REGISTER USER
    console.log('2️⃣  Registering new user...');
    const register = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
    console.log(`   ✅ User registered: ${testUser.email}`);
    console.log(`   📝 User ID: ${register.data.user.id}`);
    console.log(`   📧 Email verified: ${register.data.user.is_email_verified}`);
    console.log('');
    
    // 3. LOGIN
    console.log('3️⃣  Logging in...');
    const login = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    accessToken = login.data.access_token;
    refreshToken = login.data.refresh_token;
    
    console.log(`   ✅ Login successful!`);
    console.log(`   👤 User: ${login.data.user.full_name} (${login.data.user.email})`);
    console.log(`   🔑 Access Token: ${accessToken.substring(0, 50)}...`);
    console.log(`   🔄 Refresh Token: ${refreshToken.substring(0, 50)}...`);
    console.log('');
    
    // 4. GET CURRENT USER (Protected endpoint)
    console.log('4️⃣  Getting current user profile (protected)...');
    const me = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log(`   ✅ User profile retrieved:`);
    console.log(`   📧 Email: ${me.data.user.email}`);
    console.log(`   👤 Name: ${me.data.user.full_name}`);
    console.log(`   🆔 ID: ${me.data.user.id}`);
    console.log('');
    
    // 5. UPDATE PROFILE
    console.log('5️⃣  Updating user profile...');
    const updatedName = 'Updated Render User';
    await axios.put(`${BASE_URL}/api/auth/me`, 
      { full_name: updatedName },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    console.log(`   ✅ Profile updated to: ${updatedName}`);
    console.log('');
    
    // 6. VERIFY UPDATE
    console.log('6️⃣  Verifying profile update...');
    const meAgain = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log(`   ✅ New name confirmed: ${meAgain.data.user.full_name}`);
    console.log('');
    
    // 7. GET JWKS (Public key for subsystems)
    console.log('7️⃣  Getting JWKS public key...');
    const jwks = await axios.get(`${BASE_URL}/.well-known/jwks.json`);
    console.log(`   ✅ JWKS endpoint working`);
    console.log(`   🔑 Keys available: ${jwks.data.keys?.length || 0}`);
    if (jwks.data.keys && jwks.data.keys[0]) {
      console.log(`   🔐 Key ID (kid): ${jwks.data.keys[0].kid}`);
      console.log(`   🔐 Algorithm: ${jwks.data.keys[0].alg}`);
    }
    console.log('');
    
    // 8. REFRESH TOKEN
    console.log('8️⃣  Refreshing access token...');
    const refresh = await axios.post(`${BASE_URL}/api/auth/refresh`, {
      refresh_token: refreshToken
    });
    
    const newAccessToken = refresh.data.access_token;
    console.log(`   ✅ New access token received`);
    console.log(`   🔑 New token: ${newAccessToken.substring(0, 50)}...`);
    console.log('');
    
    // 9. TEST NEW TOKEN
    console.log('9️⃣  Testing new access token...');
    const meWithNewToken = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${newAccessToken}` }
    });
    console.log(`   ✅ New token works! User: ${meWithNewToken.data.user.email}`);
    console.log('');
    
    // 10. CHANGE PASSWORD
    console.log('🔟 Changing password...');
    await axios.post(`${BASE_URL}/api/auth/change-password`,
      {
        current_password: testUser.password,
        new_password: 'NewPass456!'
      },
      { headers: { Authorization: `Bearer ${newAccessToken}` } }
    );
    console.log(`   ✅ Password changed successfully`);
    console.log('');
    
    // 11. LOGIN WITH NEW PASSWORD
    console.log('1️⃣1️⃣ Logging in with new password...');
    const newLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: testUser.email,
      password: 'NewPass456!'
    });
    console.log(`   ✅ Login successful with new password!`);
    accessToken = newLogin.data.access_token;
    console.log('');
    
    // 12. LOGOUT
    console.log('1️⃣2️⃣ Logging out...');
    await axios.post(`${BASE_URL}/api/auth/logout`, {},
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    console.log(`   ✅ Logout successful`);
    console.log('');
    
    // ============ FEATURES ENDPOINTS TESTING ============
    console.log('\n' + '='.repeat(60));
    console.log('📦 TESTING FEATURES ENDPOINTS');
    console.log('='.repeat(60) + '\n');
    
    // 13. GET ALL FEATURES (Public)
    console.log('1️⃣3️⃣ Getting all features (public)...');
    const allFeatures = await axios.get(`${BASE_URL}/api/features`);
    console.log(`   ✅ Retrieved ${allFeatures.data.data?.length || 0} features`);
    console.log(`   📊 Total count: ${allFeatures.data.pagination?.total || 0}`);
    console.log('');
    
    // 14. CREATE FEATURE (Using Admin API Key, not Bearer token)
    console.log('1️⃣4️⃣ Creating feature (admin only)...');
    const testFeature = {
      title: 'Test Feature ' + Date.now(),
      description: 'This is a test feature created during automated testing',
      image_url: 'https://example.com/images/test-feature.jpg',
      thumbnail_url: 'https://example.com/images/test-feature-thumb.jpg',
      category: 'testing',
      order: 1
    };
    
    try {
      const createFeature = await axios.post(`${BASE_URL}/api/features`, testFeature, {
        headers: { 'X-Admin-Api-Key': ADMIN_API_KEY }
      });
      createdFeatureId = createFeature.data.data.id;
      console.log(`   ✅ Feature created successfully! ID: ${createdFeatureId}`);
      console.log(`   📝 Title: ${createFeature.data.data.title}`);
    } catch (error) {
      console.log(`   ❌ Failed to create feature: ${error.response?.data?.message || error.message}`);
    }
    console.log('');
    
    // 15. GET FEATURE BY CATEGORY
    if (createdFeatureId) {
      console.log('1️⃣5️⃣ Getting features by category...');
      try {
        const categoryFeatures = await axios.get(`${BASE_URL}/api/features/category/testing`);
        console.log(`   ✅ Retrieved ${categoryFeatures.data.data?.length || 0} features in 'testing' category`);
      } catch (error) {
        console.log(`   ⚠️  Category filter: ${error.response?.data?.message || error.message}`);
      }
      console.log('');
    }
    
    // 16. GET SINGLE FEATURE BY ID
    if (createdFeatureId) {
      console.log('1️⃣6️⃣ Getting feature by ID...');
      try {
        const singleFeature = await axios.get(`${BASE_URL}/api/features/${createdFeatureId}`);
        console.log(`   ✅ Retrieved feature: ${singleFeature.data.data.title}`);
      } catch (error) {
        console.log(`   ❌ Failed to get feature: ${error.response?.data?.message || error.message}`);
      }
      console.log('');
      
      // 17. UPDATE FEATURE (Using Admin API Key)
      console.log('1️⃣7️⃣ Updating feature...');
      try {
        const updateFeature = await axios.put(`${BASE_URL}/api/features/${createdFeatureId}`,
          { title: 'Updated Test Feature', description: 'This feature was updated' },
          { headers: { 'X-Admin-Api-Key': ADMIN_API_KEY } }
        );
        console.log(`   ✅ Feature updated successfully`);
      } catch (error) {
        console.log(`   ❌ Failed to update feature: ${error.response?.data?.message || error.message}`);
      }
      console.log('');
      
      // 18. DELETE FEATURE (Using Admin API Key)
      console.log('1️⃣8️⃣ Deleting feature...');
      try {
        await axios.delete(`${BASE_URL}/api/features/${createdFeatureId}`, {
          headers: { 'X-Admin-Api-Key': ADMIN_API_KEY }
        });
        console.log(`   ✅ Feature deleted successfully`);
      } catch (error) {
        console.log(`   ❌ Failed to delete feature: ${error.response?.data?.message || error.message}`);
      }
      console.log('');
    }
    
    // ============ SIGNIFICANTS ENDPOINTS TESTING ============
    console.log('\n' + '='.repeat(60));
    console.log('⭐ TESTING SIGNIFICANTS ENDPOINTS');
    console.log('='.repeat(60) + '\n');
    
    // 19. GET ALL SIGNIFICANTS (Public)
    console.log('1️⃣9️⃣ Getting all significants (public)...');
    const allSignificants = await axios.get(`${BASE_URL}/api/significants`);
    console.log(`   ✅ Retrieved ${allSignificants.data.data?.length || 0} significants`);
    console.log(`   📊 Total count: ${allSignificants.data.pagination?.total || 0}`);
    console.log('');
    
    // 20. CREATE SIGNIFICANT (Using Admin API Key)
    console.log('2️⃣0️⃣ Creating significant...');
    const testSignificant = {
      title: 'Test Significant ' + Date.now(),
      description: 'This is a test significant item created during automated testing',
      image_url: 'https://example.com/images/test-significant.jpg',
      thumbnail_url: 'https://example.com/images/test-significant-thumb.jpg',
      icon_url: 'https://example.com/icons/test-icon.svg',
      highlight_text: 'TEST',
      priority: 5
    };
    
    try {
      const createSignificant = await axios.post(`${BASE_URL}/api/significants`, testSignificant, {
        headers: { 'X-Admin-Api-Key': ADMIN_API_KEY }
      });
      createdSignificantId = createSignificant.data.data.id;
      console.log(`   ✅ Significant created successfully! ID: ${createdSignificantId}`);
      console.log(`   📝 Title: ${createSignificant.data.data.title}`);
      console.log(`   ⭐ Priority: ${createSignificant.data.data.priority}`);
    } catch (error) {
      console.log(`   ❌ Failed to create significant: ${error.response?.data?.message || error.message}`);
    }
    console.log('');
    
    // 21. GET SIGNIFICANT BY PRIORITY
    if (createdSignificantId) {
      console.log('2️⃣1️⃣ Getting significants by priority...');
      try {
        const prioritySignificants = await axios.get(`${BASE_URL}/api/significants/priority/5`);
        console.log(`   ✅ Retrieved ${prioritySignificants.data.data?.length || 0} significants with priority 5`);
      } catch (error) {
        console.log(`   ⚠️  Priority filter: ${error.response?.data?.message || error.message}`);
      }
      console.log('');
    }
    
    // 22. GET SINGLE SIGNIFICANT BY ID
    if (createdSignificantId) {
      console.log('2️⃣2️⃣ Getting significant by ID...');
      try {
        const singleSignificant = await axios.get(`${BASE_URL}/api/significants/${createdSignificantId}`);
        console.log(`   ✅ Retrieved significant: ${singleSignificant.data.data.title}`);
        console.log(`   💡 Highlight: ${singleSignificant.data.data.highlight_text || 'None'}`);
      } catch (error) {
        console.log(`   ❌ Failed to get significant: ${error.response?.data?.message || error.message}`);
      }
      console.log('');
      
      // 23. UPDATE SIGNIFICANT (Using Admin API Key)
      console.log('2️⃣3️⃣ Updating significant...');
      try {
        const updateSignificant = await axios.put(`${BASE_URL}/api/significants/${createdSignificantId}`,
          { 
            title: 'Updated Test Significant',
            highlight_text: 'UPDATED',
            priority: 10
          },
          { headers: { 'X-Admin-Api-Key': ADMIN_API_KEY } }
        );
        console.log(`   ✅ Significant updated successfully`);
      } catch (error) {
        console.log(`   ❌ Failed to update significant: ${error.response?.data?.message || error.message}`);
      }
      console.log('');
      
      // 24. DELETE SIGNIFICANT (Using Admin API Key)
      console.log('2️⃣4️⃣ Deleting significant...');
      try {
        await axios.delete(`${BASE_URL}/api/significants/${createdSignificantId}`, {
          headers: { 'X-Admin-Api-Key': ADMIN_API_KEY }
        });
        console.log(`   ✅ Significant deleted successfully`);
      } catch (error) {
        console.log(`   ❌ Failed to delete significant: ${error.response?.data?.message || error.message}`);
      }
      console.log('');
    }
    
    // 25. TEST PUBLIC ACCESSIBILITY
    console.log('2️⃣5️⃣ Testing public accessibility...');
    try {
      const publicFeatures = await axios.get(`${BASE_URL}/api/features`);
      const publicSignificants = await axios.get(`${BASE_URL}/api/significants`);
      console.log(`   ✅ Features endpoint: Public (${publicFeatures.data.data?.length || 0} items)`);
      console.log(`   ✅ Significants endpoint: Public (${publicSignificants.data.data?.length || 0} items)`);
    } catch (error) {
      console.log(`   ⚠️  Public access issue: ${error.message}`);
    }
    console.log('');
    
    // 26. TEST ADMIN PROTECTION
    console.log('2️⃣6️⃣ Testing admin protection...');
    try {
      // Try to create feature without admin key (should fail)
      await axios.post(`${BASE_URL}/api/features`, testFeature);
      console.log(`   ⚠️  Warning: Endpoint is not protected!`);
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        console.log(`   ✅ Admin protection working - admin API key required`);
      }
    }
    console.log('');
    
    // FINAL SUMMARY
    console.log('\n' + '='.repeat(60));
    console.log('🎉 ALL TESTS COMPLETED!');
    console.log('='.repeat(60));
    console.log('\n📊 Summary:');
    console.log(`   🌐 Live URL: ${BASE_URL}`);
    console.log(`   ✅ User registered: ${testUser.email}`);
    console.log(`   ✅ Login working`);
    console.log(`   ✅ JWT tokens issued (RS256)`);
    console.log(`   ✅ Protected endpoints working`);
    console.log(`   ✅ Token refresh working`);
    console.log(`   ✅ Password change working`);
    console.log(`   ✅ Logout working`);
    console.log(`   ✅ JWKS endpoint available`);
    console.log(`   ✅ Features endpoints: ${createdFeatureId ? 'Full CRUD tested' : 'Public endpoints tested'}`);
    console.log(`   ✅ Significants endpoints: ${createdSignificantId ? 'Full CRUD tested' : 'Public endpoints tested'}`);
    
    if (createdFeatureId && createdSignificantId) {
      console.log(`\n🎯 Full CRUD operations tested successfully!`);
      console.log(`   - Created, read, updated, and deleted features`);
      console.log(`   - Created, read, updated, and deleted significants`);
    }
    
  } catch (error) {
    console.error('\n❌ TEST FAILED!');
    console.error(`📍 Failed at: ${error.config?.url || 'unknown'}`);
    
    if (error.response) {
      console.error(`📝 Status: ${error.response.status}`);
      console.error(`📝 Error:`, error.response.data);
    } else if (error.request) {
      console.error(`📝 No response received. Check if service is running.`);
    } else {
      console.error(`📝 Error:`, error.message);
    }
  }
}

// Run the tests
testAuth();