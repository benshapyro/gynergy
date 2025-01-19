'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

export default function LoginButton() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Initial auth check
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, 'Session:', session);
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_OUT') {
        // Clear any app state
        if (typeof window !== 'undefined') {
          window.localStorage.clear();
        }
        // Force navigation to home
        window.location.href = '/';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div style={{ position: 'relative', zIndex: 1000 }}>
      <button
        onClick={handleSignOut}
        className={user ? 'sign-out-button' : 'sign-in-button'}
        style={{
          cursor: 'pointer',
          padding: '8px 16px',
          border: '2px solid var(--color-gray-700)',
          borderRadius: '8px',
          background: 'transparent',
          color: 'white',
          fontSize: '14px',
          fontWeight: 500,
          transition: 'all 0.2s',
          position: 'relative'
        }}
      >
        {user ? 'Sign Out' : 'Sign In'}
      </button>
    </div>
  );
} 