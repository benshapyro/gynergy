'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';

type LeaderboardEntry = {
  first_name: string;
  last_name: string;
  total_points: number;
  streak_count: number;
};

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data, error } = await supabase
        .from('auth.users')
        .select('raw_user_meta_data')
        .order('raw_user_meta_data->total_points', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return;
      }

      const leaderData = data
        .map(user => ({
          first_name: user.raw_user_meta_data.first_name,
          last_name: user.raw_user_meta_data.last_name,
          total_points: user.raw_user_meta_data.total_points || 0,
          streak_count: user.raw_user_meta_data.streak_count || 0
        }))
        .filter(user => user.first_name && user.last_name);

      setLeaders(leaderData);
      setIsLoading(false);
    }

    fetchLeaderboard();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard-grid">
        <div className="header">
          <span>Rank</span>
          <span>Name</span>
          <span>Points</span>
          <span>Streak</span>
        </div>
        {leaders.map((leader, index) => (
          <div 
            key={index} 
            className="entry"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              opacity: 0,
              animation: 'slideIn 0.5s ease forwards'
            }}
          >
            <span className="rank">
              {index + 1}
              {index < 3 && <span className="medal">🏅</span>}
            </span>
            <span className="name">{`${leader.first_name} ${leader.last_name}`}</span>
            <span className="points">{leader.total_points.toLocaleString()}</span>
            <span className="streak">{leader.streak_count} days 🔥</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .leaderboard {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .leaderboard-grid {
          display: grid;
          gap: 0.5rem;
        }

        .header {
          display: grid;
          grid-template-columns: 0.5fr 2fr 1fr 1fr;
          padding: 1rem;
          font-weight: 600;
          color: var(--color-gray-400);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          letter-spacing: 0.05em;
        }

        .entry {
          display: grid;
          grid-template-columns: 0.5fr 2fr 1fr 1fr;
          padding: 1rem;
          align-items: center;
          transition: all 0.3s ease;
          border-radius: var(--radius-md);
          opacity: 0;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .entry:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(5px);
        }

        .rank {
          font-weight: bold;
          color: var(--color-primary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .medal {
          font-size: 1.2rem;
        }

        .name {
          color: var(--color-text);
          font-weight: 500;
        }

        .points {
          color: var(--color-accent);
          font-weight: 600;
          font-feature-settings: "tnum";
          font-variant-numeric: tabular-nums;
        }

        .streak {
          color: var(--color-success);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: var(--color-gray-400);
          gap: 1rem;
        }

        .loading-spinner {
          width: 2rem;
          height: 2rem;
          border: 2px solid var(--color-gray-700);
          border-top-color: var(--color-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .header, .entry {
            grid-template-columns: 0.5fr 1.5fr 1fr 1fr;
            font-size: 0.9rem;
            padding: 0.75rem;
          }

          .medal {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
} 