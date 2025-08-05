// Performance Test Script for Cricket Website Optimizations
// Run this in the browser console to test cache performance

console.log('🏏 Cricket Website Performance Test Starting...');

// Test cache performance
function testCachePerformance() {
  console.log('📊 Testing cache performance...');
  
  const startTime = performance.now();
  
  // Test home feed caching
  fetch('/api/posts')
    .then(response => response.json())
    .then(data => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      console.log(`📈 Home feed load time: ${loadTime.toFixed(2)}ms`);
      
      if (loadTime < 500) {
        console.log('✅ Excellent performance!');
      } else if (loadTime < 1000) {
        console.log('⚡ Good performance');
      } else {
        console.log('⚠️ Performance could be improved');
      }
    })
    .catch(error => {
      console.log('❌ Error testing cache:', error);
    });
}

// Test multiple rapid requests (should hit cache)
function testCacheHitRate() {
  console.log('🎯 Testing cache hit rate...');
  
  const requests = [];
  for (let i = 0; i < 5; i++) {
    const startTime = performance.now();
    requests.push(
      fetch('/api/posts')
        .then(() => {
          const endTime = performance.now();
          return endTime - startTime;
        })
    );
  }
  
  Promise.all(requests).then(times => {
    console.log('📊 Request times:', times.map(t => `${t.toFixed(2)}ms`));
    
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    console.log(`📊 Average response time: ${avgTime.toFixed(2)}ms`);
    
    // Check if later requests are faster (indicating cache hits)
    const firstRequest = times[0];
    const lastRequest = times[times.length - 1];
    
    if (lastRequest < firstRequest * 0.5) {
      console.log('✅ Cache is working! Later requests are significantly faster.');
    } else {
      console.log('ℹ️ Cache may not be active or requests are naturally fast.');
    }
  });
}

// Performance metrics summary
function getPerformanceMetrics() {
  console.log('📊 Performance Metrics Summary:');
  
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    
    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
    const firstPaint = timing.responseEnd - timing.navigationStart;
    
    console.log(`📄 Page Load Time: ${pageLoadTime}ms`);
    console.log(`⚡ DOM Content Loaded: ${domContentLoaded}ms`);
    console.log(`🎨 First Paint: ${firstPaint}ms`);
    
    // Performance recommendations
    if (pageLoadTime < 2000) {
      console.log('✅ Excellent page load performance!');
    } else if (pageLoadTime < 4000) {
      console.log('⚡ Good page load performance');
    } else {
      console.log('⚠️ Page load could be optimized');
    }
  }
  
  // Check for cache in localStorage/sessionStorage
  const cacheKeys = Object.keys(localStorage).filter(key => 
    key.includes('cache') || key.includes('posts') || key.includes('rankings')
  );
  
  if (cacheKeys.length > 0) {
    console.log('💾 Found cached data:', cacheKeys);
  } else {
    console.log('ℹ️ No cached data found in localStorage');
  }
}

// Network performance test
function testNetworkPerformance() {
  console.log('🌐 Testing network performance...');
  
  const resources = performance.getEntriesByType('resource');
  const apiRequests = resources.filter(resource => 
    resource.name.includes('api') || resource.name.includes('supabase')
  );
  
  if (apiRequests.length > 0) {
    console.log('📊 API Request Performance:');
    apiRequests.forEach(request => {
      const loadTime = request.responseEnd - request.requestStart;
      console.log(`${request.name}: ${loadTime.toFixed(2)}ms`);
    });
    
    const avgApiTime = apiRequests.reduce((sum, req) => 
      sum + (req.responseEnd - req.requestStart), 0
    ) / apiRequests.length;
    
    console.log(`📊 Average API response time: ${avgApiTime.toFixed(2)}ms`);
    
    if (avgApiTime < 300) {
      console.log('✅ Excellent API performance!');
    } else if (avgApiTime < 600) {
      console.log('⚡ Good API performance');
    } else {
      console.log('⚠️ API performance could be improved');
    }
  }
}

// Run all tests
function runPerformanceTests() {
  console.log('🚀 Starting comprehensive performance tests...');
  console.log('==========================================');
  
  getPerformanceMetrics();
  console.log('');
  
  testNetworkPerformance();
  console.log('');
  
  // Wait a bit before testing cache to ensure page is loaded
  setTimeout(() => {
    testCachePerformance();
    console.log('');
    
    setTimeout(() => {
      testCacheHitRate();
      console.log('');
      console.log('🎉 Performance tests completed!');
    }, 1000);
  }, 1000);
}

// Auto-run tests
runPerformanceTests();

// Export functions for manual testing
window.cricketPerformanceTest = {
  testCachePerformance,
  testCacheHitRate,
  getPerformanceMetrics,
  testNetworkPerformance,
  runPerformanceTests
};

console.log('ℹ️ Use cricketPerformanceTest.runPerformanceTests() to run tests again');
