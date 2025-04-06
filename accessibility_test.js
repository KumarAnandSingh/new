const axe = require('axe-core');
const puppeteer = require('puppeteer');

/**
 * Accessibility testing script using axe-core
 * Tests the Studify.in website for accessibility issues
 */
async function runAccessibilityTests() {
  console.log('Starting accessibility tests...');
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // Define pages to test
    const pages = [
      { name: 'Home', path: '/' },
      { name: 'AI Tools', path: '/ai-tools' },
      { name: 'Tutorials', path: '/tutorials' },
      { name: 'Productivity', path: '/productivity' },
      { name: 'Community', path: '/community' }
    ];
    
    // Create a new page
    const page = await browser.newPage();
    
    // Inject axe-core into the page
    await page.setBypassCSP(true);
    
    // Test each page
    for (const pageConfig of pages) {
      console.log(`\nTesting accessibility for ${pageConfig.name} page...`);
      
      // Navigate to the page
      const url = `http://localhost:3000${pageConfig.path}`;
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Inject and run axe-core
      const results = await page.evaluate(() => {
        return new Promise(resolve => {
          // Need to check if axe is already injected
          if (typeof axe === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.4.2/axe.min.js';
            script.onload = () => {
              axe.run((err, results) => {
                if (err) throw err;
                resolve(results);
              });
            };
            document.head.appendChild(script);
          } else {
            axe.run((err, results) => {
              if (err) throw err;
              resolve(results);
            });
          }
        });
      });
      
      // Log results
      console.log(`\nAccessibility results for ${pageConfig.name} page:`);
      console.log(`Violations found: ${results.violations.length}`);
      
      if (results.violations.length > 0) {
        console.log('\nViolations:');
        results.violations.forEach((violation, index) => {
          console.log(`\n${index + 1}. ${violation.help} - ${violation.impact} impact`);
          console.log(`   Description: ${violation.description}`);
          console.log(`   WCAG: ${violation.tags.filter(tag => tag.includes('wcag')).join(', ')}`);
          console.log(`   Elements affected: ${violation.nodes.length}`);
          console.log(`   Help URL: ${violation.helpUrl}`);
        });
      } else {
        console.log('No accessibility violations found!');
      }
      
      // Save results
      const fs = require('fs');
      fs.writeFileSync(
        `./testing/accessibility_${pageConfig.name.toLowerCase()}.json`,
        JSON.stringify(results, null, 2)
      );
    }
    
    console.log('\nAccessibility tests completed!');
  } catch (error) {
    console.error('Error during accessibility tests:', error);
  } finally {
    // Close the browser
    await browser.close();
  }
}

// Run the tests
runAccessibilityTests().catch(console.error);
