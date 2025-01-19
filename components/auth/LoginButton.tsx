'use client';

import { useEffect, useState } from 'react';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase-client';

export function LoginButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Check current auth status
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getCurrentUser();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: 'test@example.com', // In production, you'd want to get this from an input
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      alert('Check your email for the login link!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending login link!');
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error signing out!');
    }
  };

  if (loading) {
    return <button disabled>Loading...</button>;
  }

  return user ? (
    <button onClick={handleSignOut} className="sign-out-button">
      Sign Out
    </button>
  ) : (
    <button onClick={handleSignIn} className="sign-in-button">
      Sign In
    </button>
  );
} 