'use client';

import { createClient } from '@/lib/supabase-client';
import { AuthError, User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function LoginButton() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email: 'test@example.com', // In production, you'd want to show an email input form
    });
    if (error) console.error('Error signing in:', error.message);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <p>Welcome, {user.user_metadata.name || user.email}</p>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Sign In
    </button>
  );
} 