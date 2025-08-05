// Simple database debug script
import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and anon key
const supabaseUrl = 'your-supabase-url';
const supabaseKey = 'your-supabase-anon-key';

// Check if we're running locally with Supabase CLI
const isLocal = process.env.NODE_ENV === 'development';
const url = isLocal ? 'http://localhost:54321' : supabaseUrl;
const key = isLocal ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' : supabaseKey;

const supabase = createClient(url, key);

async function debugDatabase() {
  console.log('🔍 Database Debug Report');
  console.log('========================');
  
  try {
    // Test basic connection
    console.log('\n1. Testing connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('posts')
      .select('count', { count: 'exact' });
    
    if (connectionError) {
      console.error('❌ Connection failed:', connectionError.message);
      return;
    }
    
    console.log('✅ Connection successful');
    
    // Check posts table
    console.log('\n2. Checking posts table...');
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, title, slug, post_type, status, created_at')
      .limit(5);
    
    if (postsError) {
      console.error('❌ Posts query failed:', postsError.message);
    } else {
      console.log(`✅ Found ${posts.length} posts (showing first 5):`);
      posts.forEach(post => {
        console.log(`  - ${post.title} (${post.post_type}, ${post.status})`);
      });
    }
    
    // Check for materialized views
    console.log('\n3. Checking for materialized views...');
    const { data: views, error: viewsError } = await supabase
      .from('posts_optimized')
      .select('count', { count: 'exact' });
    
    if (viewsError) {
      console.log('⚠️  posts_optimized view not found - using fallback queries');
    } else {
      console.log('✅ Materialized view exists and working');
    }
    
    // Check rankings
    console.log('\n4. Checking rankings...');
    const { data: rankings, error: rankingsError } = await supabase
      .from('icc_rankings')
      .select('id, team_name, format, rank_position')
      .limit(3);
    
    if (rankingsError) {
      console.error('❌ Rankings query failed:', rankingsError.message);
    } else {
      console.log(`✅ Found ${rankings.length} ranking entries`);
    }
    
    console.log('\n========================');
    console.log('🏁 Debug complete');
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the debug
debugDatabase();
