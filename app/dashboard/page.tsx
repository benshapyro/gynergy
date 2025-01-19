'use client';

import { DailyQuote } from '@/components/journal/DailyQuote';
import { JournalStatus } from '@/components/journal/JournalStatus';
import { DailyAction } from '@/components/journal/DailyAction';
import MountainProgress from '@/components/journal/MountainProgress';

const MILESTONES = [
  { points: 0, label: 'Base Camp' },
  { points: 50, label: 'First Rest' },
  { points: 100, label: 'Halfway Point' },
  { points: 200, label: 'Final Push' },
  { points: 300, label: 'Summit' }
];

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <div className="container">
        <header className="dashboard-header">
          <h1>YOUR JOURNEY OF GROWTH</h1>
          <p className="subtitle">Track your progress and embrace self-discovery</p>
        </header>

        <MountainProgress
          totalPoints={300}
          currentPoints={75}
          milestones={MILESTONES}
        />

        <div className="dashboard-grid">
          <div className="card inspiration-card">
            <DailyQuote />
          </div>

          <div className="card status-card">
            <JournalStatus type="morning" />
          </div>

          <div className="card action-card">
            <DailyAction />
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          padding: var(--spacing-xl) 0;
          background: linear-gradient(
            180deg,
            var(--color-background) 0%,
            var(--color-gray-900) 100%
          );
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: var(--spacing-2xl);
          padding: 0 var(--spacing-xl);
        }

        .dashboard-header h1 {
          font-size: 2.5rem;
          letter-spacing: 0.1em;
          background: linear-gradient(
            to right,
            var(--color-text) 0%,
            var(--color-gray-300) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: var(--spacing-sm);
        }

        .subtitle {
          color: var(--color-gray-400);
          font-size: 1rem;
          letter-spacing: 0.05em;
          margin-top: 0;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-lg);
          margin-top: var(--spacing-2xl);
          padding: 0 var(--spacing-md);
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        .card {
          height: 100%;
          background: rgba(38, 38, 38, 0.5);
          backdrop-filter: blur(10px);
          border: 1px solid var(--color-gray-800);
          border-radius: 16px;
          padding: var(--spacing-xl);
          transition: all var(--transition-normal);
        }

        .card:hover {
          transform: translateY(-4px);
          border-color: var(--color-gray-700);
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.2),
            0 8px 40px rgba(0, 0, 0, 0.1);
        }

        .inspiration-card {
          background: linear-gradient(
            135deg,
            rgba(212, 193, 165, 0.1) 0%,
            rgba(38, 38, 38, 0.5) 100%
          );
          border-color: var(--color-primary);
        }

        .inspiration-card:hover {
          border-color: var(--color-accent);
          box-shadow: 
            0 4px 20px rgba(212, 193, 165, 0.1),
            0 8px 40px rgba(212, 193, 165, 0.05);
        }

        .status-card {
          background: linear-gradient(
            135deg,
            rgba(64, 64, 64, 0.5) 0%,
            rgba(38, 38, 38, 0.5) 100%
          );
        }

        .action-card {
          background: linear-gradient(
            135deg,
            rgba(74, 74, 74, 0.5) 0%,
            rgba(38, 38, 38, 0.5) 100%
          );
        }
      `}</style>
    </div>
  );
}
