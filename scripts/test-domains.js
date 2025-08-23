#!/usr/bin/env node

/**
 * Quick test script to verify domain routing works locally
 * Run with: node scripts/test-domains.js
 */

const http = require('http');

const testDomains = [
  { host: 'localhost:3000', expected: 'GetReceipts' },
  { host: 'factcheck.local:3000', expected: 'FactCheck Portal' },
  { host: 'claims.local:3000', expected: 'ClaimsTracker' },
];

async function testDomain(host, expectedBrand) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
      headers: {
        'Host': host
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const success = data.includes(expectedBrand);
        resolve({
          host,
          expectedBrand,
          success,
          status: res.statusCode
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        host,
        expectedBrand,
        success: false,
        error: error.message
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing domain routing...\n');
  console.log('Make sure your Next.js dev server is running on localhost:3000\n');
  
  const results = await Promise.all(
    testDomains.map(({ host, expected }) => testDomain(host, expected))
  );

  results.forEach((result) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.host} → ${result.expectedBrand}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    if (!result.success && !result.error) {
      console.log(`   Expected "${result.expectedBrand}" but brand not found in response`);
    }
  });

  const allPassed = results.every(r => r.success);
  
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('🎉 All domain tests passed!');
    console.log('\nTo test with custom domains:');
    console.log('1. Add entries to /etc/hosts:');
    console.log('   127.0.0.1 factcheck.local');
    console.log('   127.0.0.1 claims.local');
    console.log('2. Visit http://factcheck.local:3000 and http://claims.local:3000');
  } else {
    console.log('❌ Some tests failed. Check your middleware and domain config.');
    console.log('\nTroubleshooting:');
    console.log('- Ensure Next.js dev server is running');
    console.log('- Check middleware.ts domain configurations');
    console.log('- Verify homepage components exist');
  }
}

runTests().catch(console.error);
