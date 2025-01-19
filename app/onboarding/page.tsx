'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Could not get user information');
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
          onboarded: true,
        }
      });

      if (updateError) {
        throw updateError;
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="onboarding">
      <div className="onboarding-container">
        <h1>Welcome to Your Journey</h1>
        <p className="subtitle">Let's get to know you better</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
              minLength={2}
              maxLength={50}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              required
              minLength={2}
              maxLength={50}
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading || !firstName.trim() || !lastName.trim()}
          >
            {isLoading ? 'Setting Up...' : 'Start My Journey'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .onboarding {
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

        .onboarding-container {
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

        .error-message {
          color: var(--color-error);
          margin-bottom: var(--spacing-md);
          padding: var(--spacing-sm);
          background: var(--color-error-bg);
          border-radius: var(--radius-md);
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