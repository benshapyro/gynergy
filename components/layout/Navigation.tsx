'use client';

import { usePathname } from 'next/navigation';
import { LoginButton } from '../auth/LoginButton';

export function Navigation() {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <nav className="navigation">
      <div className="container">
        <div className="nav-content">
          <a href="/" className="logo">GYNERGY</a>
          {!isLandingPage && <LoginButton />}
        </div>
      </div>

      <style jsx>{`
        .navigation {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--color-gray-800);
        }

        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 64px;
          padding: 0 var(--spacing-md);
        }

        .logo {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--color-text);
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .logo:hover {
          color: var(--color-primary);
        }

        :global(.sign-in-button),
        :global(.sign-out-button) {
          padding: var(--spacing-sm) var(--spacing-lg);
          font-size: 0.875rem;
          letter-spacing: 0.05em;
          border-radius: 8px;
          transition: all var(--transition-normal);
        }

        :global(.sign-in-button) {
          background: var(--color-primary);
          color: var(--color-background);
        }

        :global(.sign-in-button:hover) {
          background: var(--color-accent);
          transform: translateY(-1px);
        }

        :global(.sign-out-button) {
          background: transparent;
          color: var(--color-text);
          border: 1px solid var(--color-gray-700);
        }

        :global(.sign-out-button:hover) {
          border-color: var(--color-gray-500);
          transform: translateY(-1px);
        }
      `}</style>
    </nav>
  );
} 