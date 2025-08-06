import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkAdminStatus(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        checkAdminStatus(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (user: User | null) => {
    if (!user) {
      console.log('checkAdminStatus - No user, setting isAdmin to false');
      setIsAdmin(false);
      return;
    }

    console.log('checkAdminStatus - Checking admin status for user:', user.email);
    
    // For now, let's use a simple approach based on email
    // This bypasses the database issue temporarily
    const adminEmails = ['superfreundnp@gmail.com', 'admin@cricnews.com'];
    
    if (adminEmails.includes(user.email || '')) {
      console.log('checkAdminStatus - User is admin (by email), setting isAdmin to true');
      setIsAdmin(true);
      
      // Try to create the user record in the background
      try {
        const { error: insertError } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            email: user.email,
            role: 'admin'
          }, { onConflict: 'id' });

        if (insertError) {
          console.log('checkAdminStatus - Failed to create user record:', insertError);
        } else {
          console.log('checkAdminStatus - Successfully created/updated user record');
        }
      } catch (error) {
        console.log('checkAdminStatus - Error creating user record:', error);
      }
    } else {
      console.log('checkAdminStatus - User is not admin, setting isAdmin to false');
      setIsAdmin(false);
      
      // Try to create the user record in the background
      try {
        const { error: insertError } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            email: user.email,
            role: 'user'
          }, { onConflict: 'id' });

        if (insertError) {
          console.log('checkAdminStatus - Failed to create user record:', insertError);
        } else {
          console.log('checkAdminStatus - Successfully created/updated user record');
        }
      } catch (error) {
        console.log('checkAdminStatus - Error creating user record:', error);
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    isAdmin,
    signIn,
    signOut,
  };
}