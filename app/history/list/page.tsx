"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase-client";
import Link from "next/link";

interface JournalEntry {
  id: string;
  date: string;
  morning_completed: boolean;
  morning_mood_score: number;
  morning_mood_factors: string[];
  morning_reflection: string;
  evening_completed: boolean;
  evening_mood_score: number;
  evening_mood_factors: string[];
  evening_reflection: string;
  gratitude_action_completed: boolean;
  total_points: number;
}

export default function HistoryListPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    try {
      const supabase = createClient();
      
      // Add debug logging for auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Auth user:', user);
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      if (!user) {
        console.error('No authenticated user found');
        throw new Error('Not authenticated');
      }

      console.log('Fetching entries for user:', user.id);
      const { data, error } = await supabase
        .from('journal_entries')
        .select(`
          id,
          date,
          morning_completed,
          morning_mood_score,
          morning_mood_factors,
          morning_reflection,
          evening_completed,
          evening_mood_score,
          evening_mood_factors,
          evening_reflection,
          gratitude_action_completed,
          total_points
        `)
        .eq('user_id', user.id)  // Add explicit user_id filter
        .order('date', { ascending: false });

      // Add debug logging for query results
      console.log('Query response:', { data, error });
      if (error) {
        console.error('Query error:', error);
        throw error;
      }
      
      setEntries(data as JournalEntry[] || []);
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch entries');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="history-container">
      <div className="header">
        <h1>Journal History</h1>
        <div className="view-toggle">
          <Link href="/history/list" className="view-button active">List View</Link>
          <Link href="/history/calendar" className="view-button">Calendar View</Link>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading entries...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : entries.length === 0 ? (
        <div className="empty">No journal entries yet. Start your journey today!</div>
      ) : (
        <div className="entries-list">
          {entries.map((entry) => (
            <div key={entry.id} className="entry-card">
              <div className="entry-header">
                <h2>{format(new Date(entry.date), 'MMMM d, yyyy')}</h2>
                <span className="points">{entry.total_points} points</span>
              </div>

              {entry.morning_completed && (
                <div className="section morning">
                  <h3>
                    <span className="icon">🌅</span> Morning
                    <span className="mood">Mood: {entry.morning_mood_score}/5</span>
                  </h3>
                  <p className="reflection">{entry.morning_reflection}</p>
                  {entry.morning_mood_factors.length > 0 && (
                    <div className="factors">
                      {entry.morning_mood_factors.map((factor, i) => (
                        <span key={i} className="factor">{factor}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {entry.evening_completed && (
                <div className="section evening">
                  <h3>
                    <span className="icon">🌙</span> Evening
                    <span className="mood">Mood: {entry.evening_mood_score}/5</span>
                  </h3>
                  <p className="reflection">{entry.evening_reflection}</p>
                  {entry.evening_mood_factors.length > 0 && (
                    <div className="factors">
                      {entry.evening_mood_factors.map((factor, i) => (
                        <span key={i} className="factor">{factor}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {entry.gratitude_action_completed && (
                <div className="section gratitude">
                  <h3><span className="icon">💝</span> Gratitude Action Completed</h3>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .history-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
          color: white;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        h1 {
          font-size: 2rem;
          font-weight: 600;
          color: rgb(240, 240, 240);
        }

        .view-toggle {
          display: flex;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.5rem;
          border-radius: 0.5rem;
        }

        .view-button {
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          color: rgb(200, 200, 200);
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .view-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .view-button.active {
          background: rgba(255, 200, 120, 0.2);
          color: rgb(255, 200, 120);
        }

        .loading,
        .error,
        .empty {
          text-align: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          color: rgb(200, 200, 200);
        }

        .error {
          color: rgb(255, 100, 100);
        }

        .entries-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .entry-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          padding: 1.5rem;
        }

        .entry-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .entry-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: rgb(240, 240, 240);
        }

        .points {
          background: rgba(255, 200, 120, 0.2);
          color: rgb(255, 200, 120);
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .section {
          margin-bottom: 1.5rem;
          padding-left: 1rem;
          border-left: 2px solid;
        }

        .section.morning {
          border-color: rgb(255, 200, 120);
        }

        .section.evening {
          border-color: rgb(160, 200, 255);
        }

        .section.gratitude {
          border-color: rgb(255, 160, 200);
        }

        .section h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: 500;
          color: rgb(220, 220, 220);
          margin-bottom: 0.75rem;
        }

        .icon {
          font-size: 1.25rem;
        }

        .mood {
          margin-left: auto;
          font-size: 0.875rem;
          color: rgb(180, 180, 180);
        }

        .reflection {
          color: rgb(200, 200, 200);
          font-size: 0.9375rem;
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }

        .factors {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .factor {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          color: rgb(180, 180, 180);
        }

        @media (max-width: 768px) {
          .history-container {
            padding: 1rem;
          }

          .header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .entry-header {
            flex-direction: column;
            gap: 0.5rem;
          }

          .points {
            align-self: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
