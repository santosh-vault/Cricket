// Debug utility for Cricket Website
// Add this to your browser console to debug issues

(function() {
  'use strict';
  
  // Debug state
  window.cricketDebug = {
    logs: [],
    startTime: Date.now()
  };
  
  // Enhanced logging
  const originalLog = console.log;
  const originalError = console.error;
  
  console.log = function(...args) {
    window.cricketDebug.logs.push({
      type: 'log',
      time: Date.now() - window.cricketDebug.startTime,
      args: args
    });
    originalLog.apply(console, args);
  };
  
  console.error = function(...args) {
    window.cricketDebug.logs.push({
      type: 'error',
      time: Date.now() - window.cricketDebug.startTime,
      args: args
    });
    originalError.apply(console, args);
  };
  
  // Database connection test
  window.testDatabase = async function() {
    console.log('🔍 Testing database connection...');
    
    try {
      // Test if supabase is available
      if (typeof window.supabase === 'undefined') {
        console.error('❌ Supabase client not found');
        return false;
      }
      
      // Test simple query
      const { data, error } = await window.supabase
        .from('posts')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error('❌ Database connection failed:', error);
        return false;
      }
      
      console.log('✅ Database connection successful');
      return true;
    } catch (err) {
      console.error('❌ Database test error:', err);
      return false;
    }
  };
  
  // Cache inspection
  window.inspectCache = function() {
    console.log('🔍 Inspecting cache state...');
    
    const localStorage = window.localStorage;
    const sessionStorage = window.sessionStorage;
    
    console.log('LocalStorage keys:', Object.keys(localStorage));
    console.log('SessionStorage keys:', Object.keys(sessionStorage));
    
    // Look for any cached data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('cache') || key.includes('posts') || key.includes('cricket'))) {
        console.log(`Cache entry [${key}]:`, localStorage.getItem(key));
      }
    }
  };
  
  // Network monitoring
  window.monitorNetwork = function() {
    console.log('🌐 Starting network monitoring...');
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('supabase') || entry.name.includes('api')) {
          console.log(`🌐 API Call: ${entry.name}`);
          console.log(`   Duration: ${entry.duration.toFixed(2)}ms`);
          console.log(`   Status: ${entry.responseStatus || 'unknown'}`);
        }
      }
    });
    
    observer.observe({ entryTypes: ['resource'] });
    
    // Stop monitoring after 1 minute
    setTimeout(() => {
      observer.disconnect();
      console.log('🌐 Network monitoring stopped');
    }, 60000);
  };
  
  // Check for common issues
  window.checkCommonIssues = function() {
    console.log('🔍 Checking for common issues...');
    
    const issues = [];
    
    // Check if we're in development mode
    if (window.location.hostname !== 'localhost') {
      issues.push('⚠️ Not running on localhost - production environment detected');
    }
    
    // Check if environment variables are loaded
    if (!window.location.href.includes('localhost') && 
        (!import.meta || !import.meta.env || !import.meta.env.VITE_SUPABASE_URL)) {
      issues.push('❌ Environment variables may not be loaded properly');
    }
    
    // Check for JavaScript errors
    if (window.cricketDebug.logs.some(log => log.type === 'error')) {
      issues.push('❌ JavaScript errors detected in console');
    }
    
    // Check React DevTools
    if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
      issues.push('ℹ️ React DevTools not installed');
    }
    
    if (issues.length === 0) {
      console.log('✅ No common issues detected');
    } else {
      console.log('Issues found:');
      issues.forEach(issue => console.log(issue));
    }
    
    return issues;
  };
  
  // Test article creation
  window.testArticleCreation = async function() {
    console.log('📝 Testing article creation flow...');
    
    if (!window.testDatabase) {
      console.error('❌ Database test function not available');
      return;
    }
    
    const dbConnected = await window.testDatabase();
    if (!dbConnected) {
      console.error('❌ Cannot test article creation - database not connected');
      return;
    }
    
    console.log('✅ Database connected, article creation should work');
    console.log('💡 If articles still fail to save, check:');
    console.log('   1. User authentication status');
    console.log('   2. Network connectivity');  
    console.log('   3. Supabase project status');
    console.log('   4. RLS (Row Level Security) policies');
  };
  
  // Generate debug report
  window.generateDebugReport = function() {
    console.log('📊 Generating debug report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      issues: window.checkCommonIssues(),
      logs: window.cricketDebug.logs.slice(-20), // Last 20 logs
      performance: {
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
      }
    };
    
    console.log('Debug Report:', report);
    
    // Copy to clipboard if possible
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(report, null, 2))
        .then(() => console.log('📋 Debug report copied to clipboard'))
        .catch(() => console.log('📋 Could not copy to clipboard'));
    }
    
    return report;
  };
  
  // Auto-run basic checks
  console.log('🏏 Cricket Website Debug Utility Loaded');
  console.log('📋 Available commands:');
  console.log('   testDatabase() - Test database connection');
  console.log('   inspectCache() - Check cache state');
  console.log('   monitorNetwork() - Monitor API calls');
  console.log('   checkCommonIssues() - Check for common problems');
  console.log('   testArticleCreation() - Test article creation flow');
  console.log('   generateDebugReport() - Generate full debug report');
  
  // Run basic checks automatically
  setTimeout(() => {
    window.checkCommonIssues();
  }, 2000);
  
})();
