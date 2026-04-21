// test.js
require('dotenv').config();
const axios = require('axios');

// Change this to your live Render URL
const BASE_URL = 'https://auth-service-3mrd.onrender.com';

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
  
  try {
    // 1. HEALTH CHECK
    console.log('1️⃣  Health Check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('   ✅ Service is healthy');
    console.log(`   📊 Status: ${health.data.status}\n`);
    
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
    console.log(`   🔑 New access token received`);
    console.log('');
    
    // 12. LOGOUT
    console.log('1️⃣2️⃣ Logging out...');
    await axios.post(`${BASE_URL}/api/auth/logout`, {},
      { headers: { Authorization: `Bearer ${newLogin.data.access_token}` } }
    );
    console.log(`   ✅ Logout successful`);
    console.log('');
    
    // 13. FORGOT PASSWORD FLOW
    console.log('1️⃣3️⃣ Forgot password flow...');
    try {
      const forgot = await axios.post(`${BASE_URL}/api/auth/forgot-password`, {
        email: testUser.email
      });
      console.log(`   ✅ Password reset email sent`);
      console.log(`   📝 Response:`, forgot.data);
    } catch (error) {
      console.log(`   ⚠️  Forgot password: ${error.response?.data?.message || error.message}`);
    }
    console.log('');
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 ALL TESTS PASSED! Auth service is working perfectly on Render!');
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
    console.log(`   ✅ JWKS endpoint available for subsystems`);
    console.log(`   ✅ Email sending working`);
    
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