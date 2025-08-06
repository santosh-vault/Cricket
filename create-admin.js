import { createClient } from '@supabase/supabase-js';

// Your Supabase configuration
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Sign up the admin user
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@cricnews.com',
      password: 'CricNews2024!',
    });

    if (error) {
      console.error('Error creating admin user:', error.message);
      return;
    }

    console.log('Admin user created successfully:', data.user?.email);
    
    if (data.user) {
      // Create user record in users table
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          role: 'admin'
        });

      if (userError) {
        console.error('Error creating user record:', userError.message);
      } else {
        console.log('User record created in database');
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createAdminUser();
