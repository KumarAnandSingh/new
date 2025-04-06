const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

/**
 * Performance testing script using Lighthouse
 * Tests the Studify.in website performance metrics
 */
async function runPerformanceTests() {
  console.log('Starting performance tests with Lighthouse...');
  
  // Launch Chrome
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
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
    
    // Test each page
    for (const page of pages) {
      console.log(`\nTesting performance for ${page.name} page...`);
      
      // Run Lighthouse
      const url = `http://localhost:3000${page.path}`;
      const options = {
        port: chrome.port,
        output: 'json',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        logLevel: 'info'
      };
      
      const results = await lighthouse(url, options);
      const report = results.lhr;
      
      // Log results
      console.log(`\nResults for ${page.name} page:`);
      console.log(`Performance score: ${report.categories.performance.score * 100}/100`);
      console.log(`Accessibility score: ${report.categories.accessibility.score * 100}/100`);
      console.log(`Best Practices score: ${report.categories['best-practices'].score * 100}/100`);
      console.log(`SEO score: ${report.categories.seo.score * 100}/100`);
      
      // Log key metrics
      console.log('\nKey metrics:');
      console.log(`First Contentful Paint: ${report.audits['first-contentful-paint'].displayValue}`);
      console.log(`Largest Contentful Paint: ${report.audits['largest-contentful-paint'].displayValue}`);
      console.log(`Time to Interactive: ${report.audits['interactive'].displayValue}`);
      console.log(`Total Blocking Time: ${report.audits['total-blocking-time'].displayValue}`);
      console.log(`Cumulative Layout Shift: ${report.audits['cumulative-layout-shift'].displayValue}`);
      
      // Save report
      const fs = require('fs');
      fs.writeFileSync(
        `./testing/lighthouse_${page.name.toLowerCase()}.json`,
        JSON.stringify(report, null, 2)
      );
      
      // Identify improvement opportunities
      console.log('\nImprovement opportunities:');
      const opportunities = [
        'render-blocking-resources',
        'unminified-css',
        'unminified-javascript',
        'unused-css-rules',
        'unused-javascript',
        'offscreen-images',
        'uses-responsive-images',
        'uses-rel-preconnect',
        'uses-text-compression'
      ];
      
      for (const opportunity of opportunities) {
        if (report.audits[opportunity] && report.audits[opportunity].score < 1) {
          console.log(`- ${report.audits[opportunity].title}: ${report.audits[opportunity].displayValue}`);
        }
      }
    }
    
    console.log('\nPerformance tests completed!');
  } catch (error) {
    console.error('Error during performance tests:', error);
  } finally {
    // Close Chrome
    await chrome.kill();
  }
}

// Run the tests
runPerformanceTests().catch(console.error);
