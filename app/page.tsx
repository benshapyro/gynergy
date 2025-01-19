'use client';

import { useState } from 'react';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'info' | 'error' }>({ text: '', type: 'info' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: 'info' });

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setMessage({
        text: data.message,
        type: 'info'
      });
      setEmail('');
    } catch (error) {
      console.error('Error:', error);
      setMessage({
        text: 'Error sending login link. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>WELCOME TO GYNERGY JOURNAL</h1>
          <p className="hero-subtitle">Your Journey of Growth and Self-Discovery Begins Here</p>
          
          <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email to begin"
                  required
                  disabled={isLoading}
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="sign-in-button"
              >
                {isLoading ? 'One moment...' : 'Continue →'}
              </button>
              {message.text && (
                <p className={`auth-message ${message.type}`}>
                  {message.text}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .landing-page {
          min-height: calc(100vh - 64px);
          display: flex;
          flex-direction: column;
        }

        .hero-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-3xl) var(--spacing-md);
          background: linear-gradient(
            to bottom,
            transparent,
            var(--color-gray-900)
          );
        }

        .hero-content {
          max-width: 600px;
          text-align: center;
        }

        .hero-content h1 {
          font-size: 3.5rem;
          margin-bottom: var(--spacing-md);
          background: linear-gradient(
            to right,
            var(--color-text),
            var(--color-primary)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--color-gray-300);
          margin-bottom: var(--spacing-2xl);
          line-height: 1.5;
        }

        .auth-container {
          background: rgba(38, 38, 38, 0.5);
          backdrop-filter: blur(10px);
          border: 1px solid var(--color-gray-800);
          border-radius: 16px;
          padding: var(--spacing-xl);
          margin-top: var(--spacing-2xl);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          max-width: 400px;
          margin: 0 auto;
        }

        .input-group {
          position: relative;
        }

        .input-group input {
          width: 100%;
          padding: var(--spacing-md) var(--spacing-lg);
          font-size: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--color-gray-700);
          border-radius: 8px;
          color: var(--color-text);
          transition: all var(--transition-normal);
        }

        .input-group input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px rgba(212, 193, 165, 0.1);
        }

        .input-group input:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .sign-in-button {
          width: 100%;
          padding: var(--spacing-md) var(--spacing-lg);
          font-size: 1rem;
          background: var(--color-primary);
          color: var(--color-background);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .sign-in-button:hover:not(:disabled) {
          background: var(--color-accent);
          transform: translateY(-2px);
        }

        .sign-in-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-message {
          font-size: 0.875rem;
          margin-top: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: 6px;
          background: rgba(0, 0, 0, 0.2);
        }

        .auth-message.info {
          color: var(--color-primary);
          border: 1px solid var(--color-primary);
        }

        .auth-message.error {
          color: #ef4444;
          border: 1px solid #ef4444;
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.125rem;
          }

          .auth-container {
            padding: var(--spacing-lg);
          }
        }
      `}</style>
    </div>
  );
}
  