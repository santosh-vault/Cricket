import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cvegqbgmowrqassffvcs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2ZWdxYmdtb3dycWFzc2ZmdmNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNTgxMzIsImV4cCI6MjA2NjkzNDEzMn0.aN5VXyOMZMu85DALjA9s7UMSvVQvsgURZyOey_2cXwM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...');
  
  try {
    // Test basic connection
    console.log('1. Testing posts table...');
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, title, type, is_published')
      .limit(5);
    
    if (postsError) {
      console.error('❌ Posts query failed:', postsError);
      return;
    }
    
    console.log(`✅ Posts table accessible. Found ${posts.length} posts`);
    posts.forEach(post => {
      console.log(`  - ${post.title} (${post.type}, published: ${post.is_published})`);
    });
    
    // Test auth
    console.log('\n2. Testing auth session...');
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Auth session error:', sessionError);
    } else if (session.session) {
      console.log('✅ User is authenticated:', session.session.user.email);
    } else {
      console.log('ℹ️  No active auth session (this is normal for testing)');
    }
    
    // Test users table
    console.log('\n3. Testing users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, role')
      .limit(3);
    
    if (usersError) {
      console.error('❌ Users table error:', usersError);
    } else {
      console.log(`✅ Users table accessible. Found ${users.length} users`);
    }
    
    console.log('\n✅ Database connection test completed successfully');
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

testConnection();
