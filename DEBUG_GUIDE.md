# Article Publishing Timeout Debug Guide

## The Issue

You described: "when i first open the website. everything loads perfectly. and when i login as admin, then tries to add article. article doesn't publish, its load and timed out message comes. and then if i go back to home page and reload. nothing appears, no articles should, only ui is visible without any fetched data."

## What We've Implemented

### 1. Debug Panel (Development Mode Only)

- Access: Open the website in development (localhost:5174)
- Look for a "🔧 Debug" button in the top-right corner
- Click it to open the debug panel with options:
  - **Force Refresh**: Bypasses cache and fetches fresh data
  - **Clear Cache**: Clears all cached data
  - **Test DB**: Tests direct database connection
  - **Hide**: Closes the debug panel

### 2. Optimized Queries with Fallbacks

- Created `src/lib/optimizedQueries.ts` with intelligent caching
- Added fallback mechanisms for missing materialized views
- Extended article publishing timeout from 10s to 30s

### 3. Enhanced Error Handling

- Better error messages in PostEditor
- Delayed cache invalidation to prevent race conditions
- Comprehensive logging for debugging

## Testing Steps

### Step 1: Initial Website Load

1. Open http://localhost:5174/
2. Verify articles load properly
3. Check browser console (F12) for any errors
4. Note: You should see a "🔧 Debug" button in top-right

### Step 2: Admin Login and Article Publishing

1. Navigate to Admin Login: `/admin/login`
2. Log in with admin credentials
3. Go to Admin Dashboard
4. Try to create a new article
5. **Watch for**:
   - Timeout messages (should now be 30s instead of 10s)
   - Error messages in the console
   - Network requests in browser dev tools

### Step 3: Post-Publishing Data Load Test

1. After attempting to publish (success or failure)
2. Navigate back to home page
3. **Before reloading**: Click the "🔧 Debug" button
4. Click "Test DB" to verify database connectivity
5. Click "Force Refresh" to reload data
6. **If still no data**: Click "Clear Cache" then refresh page

### Step 4: Browser Console Debugging

Open browser console (F12) and look for:

```
🔧 Debug: Force refreshing posts...
🔧 Debug: Got X posts
Fetching unified feed...
Home feed fetch result: X posts
```

## Common Issues and Solutions

### Issue 1: No Articles After Publishing Attempt

**Symptoms**: Homepage shows UI but no article content
**Debug Steps**:

1. Use Debug Panel → "Test DB" to verify connection
2. Check browser console for error messages
3. Use "Force Refresh" to bypass cache
4. If data exists in DB but not showing, it's a cache issue

### Issue 2: Article Publishing Timeout

**Symptoms**: "Request timed out" message when publishing
**Debug Steps**:

1. Check if timeout is now 30s (should be longer)
2. Look for network errors in browser dev tools
3. Verify Supabase connection and RLS policies
4. Check if article was actually saved despite timeout

### Issue 3: Database Connection Issues

**Symptoms**: "Test DB" button shows errors
**Possible Causes**:

- Missing environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- Network connectivity issues
- Supabase service down
- RLS (Row Level Security) policy issues

## Environment Variables Check

Create a `.env` file in the project root with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Performance Optimizations Applied

### Database Level

- Created indexes for frequently queried columns
- Prepared materialized views for faster queries
- Added fallback queries when views aren't available

### Application Level

- Intelligent caching with TTL (Time To Live)
- Cache invalidation strategies
- Optimized data fetching patterns

## Next Steps

1. **Test the current implementation** with the debug panel
2. **Apply database migrations** if needed (run the SQL migration files)
3. **Monitor performance** using the debug tools
4. **Report specific errors** from browser console for further debugging

## Quick Commands for Debugging

In browser console, you can also run:

```javascript
// Force refresh posts
window.debugRefreshPosts = async () => {
  const { forceRefreshPosts } = await import("./lib/optimizedQueries");
  return await forceRefreshPosts();
};

// Clear all caches
window.debugClearCache = async () => {
  const { clearAllCaches } = await import("./lib/optimizedQueries");
  clearAllCaches();
};
```
