'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';

export default function LandingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'info' | 'error' }>({ text: '', type: 'info' });

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', { event, session });
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in, redirecting...', { 
          isOnboarded: session?.user?.user_metadata?.onboarded 
        });
        // Check if user is onboarded
        const isOnboarded = session?.user?.user_metadata?.onboarded;
        router.push(isOnboarded ? '/dashboard' : '/onboarding');
      }
    });

    // Check if we already have a session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Initial session check:', { session });
      if (session) {
        const isOnboarded = session?.user?.user_metadata?.onboarded;
        console.log('Existing session found, redirecting...', { isOnboarded });
        router.push(isOnboarded ? '/dashboard' : '/onboarding');
      }
    };
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: 'info' });

    try {
      console.log('Attempting sign in with:', { email });
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      console.log('Sign in response:', { data, error });

      if (error) throw error;

      // Only show the check email message in production
      if (process.env.NODE_ENV === 'production') {
        setMessage({
          text: 'Check your email for the magic link. You can stay on this page.',
          type: 'info'
        });
      } else {
        console.log('Development mode - should auto sign in');
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setMessage({
        text: 'Error sending login link. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="landing">
      <div className="auth-container">
        <h1>Welcome to Your Journey</h1>
        <p className="subtitle">Begin your path to mindful growth</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Enter your email to start or continue</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={isLoading}
            />
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading || !email.trim()}
          >
            {isLoading ? 'Sending...' : 'Start My Journey'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .landing {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-lg);
          background: linear-gradient(
            to bottom,
            var(--color-background),
            var(--color-gray-900)
          );
        }

        .auth-container {
          background: var(--color-gray-800);
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 480px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        h1 {
          color: var(--color-text);
          font-size: 2rem;
          margin-bottom: var(--spacing-xs);
          text-align: center;
        }

        .subtitle {
          color: var(--color-gray-400);
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }

        .form-group {
          margin-bottom: var(--spacing-lg);
        }

        label {
          display: block;
          color: var(--color-gray-300);
          margin-bottom: var(--spacing-xs);
        }

        input {
          width: 100%;
          padding: var(--spacing-sm);
          background: var(--color-gray-700);
          border: 2px solid var(--color-gray-600);
          border-radius: var(--radius-md);
          color: var(--color-text);
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        input:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        input:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .message {
          margin-bottom: var(--spacing-md);
          padding: var(--spacing-sm);
          border-radius: var(--radius-md);
          text-align: center;
        }

        .message.info {
          background: var(--color-info-bg);
          color: var(--color-info);
        }

        .message.error {
          background: var(--color-error-bg);
          color: var(--color-error);
        }

        .submit-button {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-button:hover:not(:disabled) {
          background: var(--color-primary-dark);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
  