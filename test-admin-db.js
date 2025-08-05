import { createClient } from '@supabase/supabase-js';

// Read from environment variables
const supabaseUrl = 'https://cvegqbgmowrqassffvcs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2ZWdxYmdtb3dycWFzc2ZmdmNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNTgxMzIsImV4cCI6MjA2NjkzNDEzMn0.aN5VXyOMZMu85DALjA9s7UMSvVQvsgURZyOey_2cXwM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdminDatabase() {
  console.log('🔍 Testing Admin Database Connection');
  console.log('====================================');
  
  try {
    // Test 1: Basic connection
    console.log('\n1. Testing basic connection...');
    const { data: testData, error: testError } = await supabase
      .from('posts')
      .select('count', { count: 'exact', head: true });
    
    if (testError) {
      console.error('❌ Basic connection failed:', testError.message);
      return;
    }
    console.log('✅ Basic connection successful');
    
    // Test 2: Check current session
    console.log('\n2. Checking authentication session...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session check failed:', sessionError.message);
    } else if (sessionData.session) {
      console.log('✅ User authenticated:', sessionData.session.user.email);
    } else {
      console.log('⚠️  No active session - user not logged in');
    }
    
    // Test 3: Try to fetch posts (this will test RLS policies)
    console.log('\n3. Testing posts query...');
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, title, type, is_published, created_at')
      .limit(5);
    
    if (postsError) {
      console.error('❌ Posts query failed:', postsError.message);
      console.error('   Error details:', postsError);
    } else {
      console.log(`✅ Posts query successful - found ${posts.length} posts`);
      posts.forEach(post => {
        console.log(`   - ${post.title} (${post.type}, ${post.is_published ? 'published' : 'draft'})`);
      });
    }
    
    // Test 4: Test creating a post (admin operation)
    console.log('\n4. Testing admin post creation (dry run)...');
    const testPost = {
      title: 'Test Post - ' + Date.now(),
      slug: 'test-post-' + Date.now(),
      content: 'This is a test post content',
      type: 'news',
      is_published: false,
      category: 'test',
      tags: ['test'],
      thumbnail_url: null
    };
    
    const { data: createData, error: createError } = await supabase
      .from('posts')
      .insert([testPost])
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Post creation failed:', createError.message);
      console.error('   Error details:', createError);
      console.error('   This might be an RLS policy issue - admin might not have insert permissions');
    } else {
      console.log('✅ Post creation successful - ID:', createData.id);
      
      // Clean up - delete the test post
      await supabase.from('posts').delete().eq('id', createData.id);
      console.log('   Test post cleaned up');
    }
    
    // Test 5: Check users table access
    console.log('\n5. Testing users table access...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, role')
      .limit(3);
    
    if (userError) {
      console.error('❌ Users table query failed:', userError.message);
    } else {
      console.log(`✅ Users table accessible - found ${userData.length} users`);
    }
    
    console.log('\n====================================');
    console.log('🏁 Database test complete');
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the test
testAdminDatabase();
