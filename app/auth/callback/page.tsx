'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.search);
      
      if (error) {
        console.error('Auth error:', error);
        router.push('/?error=auth');
        return;
      }

      // Get the user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/');
        return;
      }

      // Check if this is a new user by looking at metadata
      const isNewUser = !session.user.user_metadata.onboarded;

      // Redirect based on user status
      if (isNewUser) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="auth-callback">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Setting up your journey...</p>
      </div>

      <style jsx>{`
        .auth-callback {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            to bottom,
            var(--color-background),
            var(--color-gray-900)
          );
        }

        .loading-container {
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          margin: 0 auto var(--spacing-md);
          border: 3px solid var(--color-gray-700);
          border-top-color: var(--color-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-container p {
          color: var(--color-gray-300);
          font-size: 1.125rem;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
} 