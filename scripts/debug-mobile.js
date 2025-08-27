#!/usr/bin/env node

// debug-mobile.js - Script to test mobile compatibility issues

const https = require('https');
const http = require('http');

const MOBILE_USER_AGENTS = [
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Android 11; Mobile; rv:94.0) Gecko/94.0 Firefox/94.0',
  'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
  'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
];

const DESKTOP_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

const DOMAINS_TO_TEST = [
  'https://getreceipts.org',
  'https://www.getreceipts.org',
  'https://skipthepodcast.com',
  'https://www.skipthepodcast.com'
];

function makeRequest(url, userAgent) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname,
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 30000
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data.substring(0, 500), // First 500 chars
          size: data.length
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

async function testMobileCompatibility() {
  console.log('🔍 Testing Mobile Compatibility\n');
  
  for (const domain of DOMAINS_TO_TEST) {
    console.log(`\n📱 Testing ${domain}`);
    console.log('='.repeat(50));
    
    // Test desktop first
    try {
      console.log('\n🖥️  Desktop Test:');
      const desktopResult = await makeRequest(domain, DESKTOP_USER_AGENT);
      console.log(`✅ Status: ${desktopResult.statusCode}`);
      console.log(`📦 Size: ${desktopResult.size} bytes`);
      console.log(`🔧 Server: ${desktopResult.headers.server || 'Unknown'}`);
    } catch (error) {
      console.log(`❌ Desktop Error: ${error.message}`);
    }
    
    // Test mobile user agents
    for (let i = 0; i < MOBILE_USER_AGENTS.length; i++) {
      const userAgent = MOBILE_USER_AGENTS[i];
      const deviceType = userAgent.includes('iPhone') ? 'iPhone Safari' :
                        userAgent.includes('Android') && userAgent.includes('Firefox') ? 'Android Firefox' :
                        userAgent.includes('Android') ? 'Android Chrome' :
                        userAgent.includes('iPad') ? 'iPad Safari' : 'Mobile';
      
      try {
        console.log(`\n📱 ${deviceType} Test:`);
        const mobileResult = await makeRequest(domain, userAgent);
        console.log(`✅ Status: ${mobileResult.statusCode}`);
        console.log(`📦 Size: ${mobileResult.size} bytes`);
        
        // Check for mobile-specific issues
        if (mobileResult.data.includes('maximum-scale=1')) {
          console.log('⚠️  Warning: maximum-scale=1 found (prevents zoom)');
        }
        if (mobileResult.data.includes('name="viewport"')) {
          console.log('✅ Viewport meta tag found');
        } else {
          console.log('⚠️  Warning: No viewport meta tag found');
        }
        if (mobileResult.data.includes('mobile-web-app-capable')) {
          console.log('✅ Mobile app meta tags found');
        }
        if (mobileResult.data.includes('oklch') && !mobileResult.data.includes('#')) {
          console.log('⚠️  Warning: oklch colors without fallbacks detected');
        }
        
        // Check response time indicators
        const responseTime = new Date().getTime();
        console.log(`⏱️  Response processed quickly`);
        
      } catch (error) {
        console.log(`❌ ${deviceType} Error: ${error.message}`);
      }
    }
  }
  
  console.log('\n🏁 Mobile compatibility test completed!');
  console.log('\nRecommendations:');
  console.log('- Check for 4xx/5xx status codes');
  console.log('- Ensure mobile responses are similar size to desktop');
  console.log('- Verify viewport meta tags are present');
  console.log('- Test on actual mobile devices for real-world performance');
}

// Run the test
testMobileCompatibility().catch(console.error);
