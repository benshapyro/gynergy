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
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .header h1 {
          font-size: 2rem;
          color: var(--color-text);
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: var(--color-gray-400);
        }

        .quote-section {
          position: relative;
          margin: 4rem auto;
          padding: 3rem 4rem;
          max-width: 900px;
          background: linear-gradient(
            to bottom right,
            rgba(32, 32, 32, 0.8),
            rgba(24, 24, 24, 0.8)
          );
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          box-shadow: 
            0 4px 24px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.05);
          transform: translateZ(0);
        }

        .quote-marks {
          position: absolute;
          top: -2rem;
          left: 2rem;
          font-size: 8rem;
          font-family: "Georgia", serif;
          background: linear-gradient(
            45deg,
            rgb(255, 200, 120),
            rgb(255, 160, 80)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          opacity: 0.15;
          line-height: 1;
          pointer-events: none;
          filter: drop-shadow(0 4px 12px rgba(255, 200, 120, 0.2));
        }

        .mountain-section {
          height: 500px;
          margin: 3rem 0;
          border-radius: 16px;
          overflow: hidden;
        }

        .journal-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          margin: 3rem 0;
        }

        .card {
          background: rgba(32, 32, 32, 0.6);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          height: auto;
          min-height: 200px;
        }

        .card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 200, 120, 0.1);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        }

        .card-content {
          padding: 1.75rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .card-icon {
          font-size: 1.75rem;
          line-height: 1;
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.1));
        }

        .card-header h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: rgb(220, 220, 220);
          margin: 0;
          letter-spacing: 0.05em;
        }

        .card p {
          color: rgb(160, 160, 160);
          font-size: 0.9375rem;
          line-height: 1.5;
          margin: 0;
        }

        .card-footer {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .action-button {
          background: rgb(255, 200, 120);
          color: rgb(32, 32, 32);
          border: none;
          padding: 0.875rem 1.25rem;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          font-size: 0.9375rem;
          letter-spacing: 0.05em;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .action-button:hover {
          background: rgb(255, 220, 160);
          transform: translateY(-2px);
        }

        .action-button:active {
          transform: translateY(0);
        }

        .arrow {
          font-size: 1.125rem;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .action-button:hover .arrow {
          transform: translateX(4px);
        }

        .time-indicator {
          color: rgb(140, 140, 140);
          font-size: 0.8125rem;
          text-align: center;
          letter-spacing: 0.05em;
          padding-bottom: 0.25rem;
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

        @media (max-width: 768px) {
          .dashboard {
            padding: 1rem;
          }

          .mountain-section {
            height: 400px;
          }

          .journal-cards {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            margin: 2rem 0;
          }

          .card-content {
            padding: 1.5rem;
            gap: 1.25rem;
          }

          .card-icon {
            font-size: 1.5rem;
          }

          .card-header h3 {
            font-size: 1rem;
          }

          .card p {
            font-size: 0.875rem;
          }

          .action-button {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
          }

          .quote-section {
            margin: 3rem 1rem;
            padding: 2rem;
          }

          .quote-marks {
            font-size: 6rem;
            top: -1.5rem;
            left: 1.5rem;
          }
        }
      `}</style>
    </main>
  );
}
