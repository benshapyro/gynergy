'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LoginButton from '../auth/LoginButton';

export function Navigation() {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <nav className="navigation">
      <div className="nav-content">
        <Link href="/" className="logo">
          GYNERGY
        </Link>
        
        <div className="nav-links">
          {!isLandingPage && (
            <>
              <Link href="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link href="/profile" className="nav-link">
                Profile
              </Link>
              <Link href="/history" className="nav-link">
                History
              </Link>
            </>
          )}
          <LoginButton />
        </div>
      </div>

      <style jsx>{`
        .navigation {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .nav-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--color-text);
          text-decoration: none;
          background: linear-gradient(
            to right,
            var(--color-primary),
            var(--color-accent)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          transition: opacity 0.2s ease;
        }

        .logo:hover {
          opacity: 0.8;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          color: var(--color-gray-300);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          transition: all 0.2s ease;
          padding: 0.5rem 0;
          position: relative;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(
            to right,
            var(--color-primary),
            var(--color-accent)
          );
          opacity: 0;
          transform: scaleX(0);
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          color: var(--color-text);
        }

        .nav-link:hover::after {
          opacity: 1;
          transform: scaleX(1);
        }

        @media (max-width: 768px) {
          .nav-content {
            padding: 1rem;
          }

          .nav-links {
            gap: 1rem;
          }

          .nav-link {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </nav>
  );
} 