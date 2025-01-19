'use client';

import { DailyQuote } from '@/components/journal/DailyQuote';
import MountainProgress from '@/components/journal/MountainProgress';
import { JournalStatus } from '@/components/journal/JournalStatus';
import { DailyAction } from '@/components/journal/DailyAction';
import Leaderboard from '@/components/journal/Leaderboard';

const MILESTONES = [
  { points: 0, label: 'BASE CAMP' },
  { points: 50, label: 'FIRST REST' },
  { points: 100, label: 'HALFWAY POINT' },
  { points: 200, label: 'FINAL PUSH' },
  { points: 300, label: 'SUMMIT' }
];

export default function DashboardPage() {
  return (
    <main className="dashboard">
      {/* Header Section */}
      <header className="header">
        <h1>YOUR JOURNEY OF GROWTH</h1>
        <p className="subtitle">Track your progress and embrace self-discovery</p>
      </header>

      {/* Quote Section */}
      <div className="quote-section">
        <div className="quote-marks">"</div>
        <DailyQuote />
      </div>

      {/* Mountain Progress */}
      <div className="mountain-section">
        <MountainProgress 
          totalPoints={300}
          currentPoints={75}
          milestones={MILESTONES}
        />
        <div className="progress-stats">
          <div className="stat">
            <span className="label">Current Level</span>
            <span className="value">First Rest</span>
          </div>
          <div className="stat">
            <span className="label">Progress</span>
            <span className="value">25%</span>
          </div>
          <div className="stat">
            <span className="label">Points to Next Level</span>
            <span className="value">25 pts</span>
          </div>
        </div>
      </div>

      {/* Journal Cards */}
      <div className="journal-cards">
        <div className="card morning-card">
          <div className="card-content">
            <div className="card-header">
              <span className="card-icon">🌅</span>
              <h3>MORNING JOURNAL</h3>
            </div>
            <p>Start your day with intention</p>
            <div className="card-footer">
              <button className="action-button">
                <span>Start morning journal</span>
                <span className="arrow">→</span>
              </button>
              <span className="time-indicator">Best before 10 AM</span>
            </div>
          </div>
        </div>
        
        <div className="card evening-card">
          <div className="card-content">
            <div className="card-header">
              <span className="card-icon">🌙</span>
              <h3>EVENING JOURNAL</h3>
            </div>
            <p>Reflect on your day</p>
            <div className="card-footer">
              <button className="action-button">
                <span>Start evening journal</span>
                <span className="arrow">→</span>
              </button>
              <span className="time-indicator">Available after 6 PM</span>
            </div>
          </div>
        </div>
        
        <div className="card gratitude-card">
          <div className="card-content">
            <div className="card-header">
              <span className="card-icon">💝</span>
              <h3>DAILY GRATITUDE ACTION</h3>
            </div>
            <p>Write a thank you note to someone who helped you recently</p>
            <div className="card-footer">
              <button className="action-button">
                <span>Complete action</span>
                <span className="arrow">→</span>
              </button>
              <span className="time-indicator">Available all day</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="leaderboard-section">
        <h2 className="section-title">COMMUNITY PROGRESS</h2>
        <Leaderboard />
      </div>

      <style jsx>{`
        .dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          padding-top: 7rem; /* Increased padding to account for navigation */
          min-height: 100vh;
          background: transparent; /* Remove background as it's handled by layout */
        }

        .header {
          text-align: center;
          margin-bottom: 3rem;
          opacity: 0;
          animation: fadeIn 0.5s ease forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          background: linear-gradient(
            to right,
            var(--color-text) 0%,
            var(--color-gray-400) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: var(--color-gray-400);
          font-size: 1.1rem;
          letter-spacing: 0.05em;
        }

        .quote-section {
          position: relative;
          margin-bottom: 3rem;
          text-align: center;
          font-weight: bold;
          font-size: 1.5rem;
          padding: 3rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
        }

        .quote-marks {
          position: absolute;
          top: -1rem;
          left: 2rem;
          font-size: 8rem;
          opacity: 0.1;
          font-family: serif;
          color: var(--color-primary);
        }

        .mountain-section {
          margin: 4rem 0;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-lg);
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .progress-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .stat {
          text-align: center;
        }

        .stat .label {
          display: block;
          color: var(--color-gray-400);
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .stat .value {
          display: block;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-primary);
        }

        .journal-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin: 4rem 0;
        }

        .card {
          position: relative;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(to right, var(--color-primary), var(--color-accent));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .card:hover::before {
          opacity: 1;
        }

        .card-content {
          padding: 2rem;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .card-icon {
          font-size: 1.5rem;
        }

        .card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-text);
          letter-spacing: 0.05em;
          margin: 0;
        }

        .card p {
          color: var(--color-gray-400);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .card-footer {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .action-button {
          width: 100%;
          background: linear-gradient(
            135deg,
            var(--color-primary) 0%,
            var(--color-accent) 100%
          );
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(var(--color-primary-rgb), 0.4);
        }

        .action-button .arrow {
          transition: transform 0.3s ease;
        }

        .action-button:hover .arrow {
          transform: translateX(4px);
        }

        .time-indicator {
          font-size: 0.8rem;
          color: var(--color-gray-500);
          text-align: center;
        }

        .leaderboard-section {
          margin-top: 4rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-lg);
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 2rem;
          text-align: center;
          letter-spacing: 0.1em;
        }

        @media (max-width: 1024px) {
          .journal-cards {
            grid-template-columns: repeat(2, 1fr);
          }

          .progress-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .journal-cards {
            grid-template-columns: 1fr;
          }

          .progress-stats {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .header h1 {
            font-size: 2rem;
          }

          .quote-section {
            font-size: 1.25rem;
            padding: 2rem;
          }

          .quote-marks {
            font-size: 6rem;
          }
        }
      `}</style>
    </main>
  );
}
