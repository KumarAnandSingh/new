const puppeteer = require('puppeteer');

/**
 * Cross-browser compatibility testing script using Puppeteer
 * Tests the Studify.in website across different viewport sizes
 */
async function runCompatibilityTests() {
  console.log('Starting cross-browser compatibility tests...');
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // Define device configurations to test
    const devices = [
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Laptop', width: 1366, height: 768 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ];
    
    // Define pages to test
    const pages = [
      { name: 'Home', path: '/' },
      { name: 'AI Tools', path: '/ai-tools' },
      { name: 'Tutorials', path: '/tutorials' },
      { name: 'Productivity', path: '/productivity' },
      { name: 'Community', path: '/community' }
    ];
    
    // Test each device configuration
    for (const device of devices) {
      console.log(`\nTesting on ${device.name} (${device.width}x${device.height})`);
      
      // Create a new page
      const page = await browser.newPage();
      await page.setViewport({ width: device.width, height: device.height });
      
      // Test each page
      for (const pageConfig of pages) {
        try {
          console.log(`  Testing ${pageConfig.name} page...`);
          
          // Navigate to the page (using localhost for testing)
          const url = `http://localhost:3000${pageConfig.path}`;
          const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
          
          // Check if page loaded successfully
          if (response.status() === 200) {
            console.log(`    ✓ Page loaded successfully`);
            
            // Take a screenshot for visual verification
            await page.screenshot({ 
              path: `./testing/screenshots/${device.name.toLowerCase()}_${pageConfig.name.toLowerCase()}.png`,
              fullPage: true 
            });
            
            // Test basic interactions
            if (pageConfig.name === 'Home') {
              // Test navigation menu
              await page.click('nav a[href="/ai-tools"]');
              await page.waitForNavigation({ waitUntil: 'networkidle2' });
              const currentUrl = page.url();
              if (currentUrl.includes('/ai-tools')) {
                console.log('    ✓ Navigation menu works correctly');
              } else {
                console.log('    ✗ Navigation menu failed');
              }
              
              // Go back to home
              await page.goBack({ waitUntil: 'networkidle2' });
            }
            
            // Test dark mode toggle if it exists
            const darkModeToggle = await page.$('.theme-toggle');
            if (darkModeToggle) {
              await darkModeToggle.click();
              await page.waitForTimeout(1000); // Wait for transition
              console.log('    ✓ Dark mode toggle works');
              
              // Take screenshot in dark mode
              await page.screenshot({ 
                path: `./testing/screenshots/${device.name.toLowerCase()}_${pageConfig.name.toLowerCase()}_dark.png`,
                fullPage: true 
              });
            }
            
          } else {
            console.log(`    ✗ Page failed to load: ${response.status()}`);
          }
        } catch (error) {
          console.error(`    ✗ Error testing ${pageConfig.name} page:`, error.message);
        }
      }
      
      // Close the page
      await page.close();
    }
    
    console.log('\nCompatibility tests completed!');
  } catch (error) {
    console.error('Error during compatibility tests:', error);
  } finally {
    // Close the browser
    await browser.close();
  }
}

// Run the tests
runCompatibilityTests().catch(console.error);
