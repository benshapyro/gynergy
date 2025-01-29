"use client";

import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { createClient } from "@/lib/supabase-client";
import Link from "next/link";

interface JournalEntry {
  id: string;
  date: string;
  morning_completed: boolean;
  evening_completed: boolean;
  gratitude_action_completed: boolean;
  total_points: number;
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEntries();
  }, [currentMonth]);

  async function fetchEntries() {
    try {
      const supabase = createClient();
      const startDate = startOfMonth(currentMonth);
      const endDate = endOfMonth(currentMonth);

      const { data, error } = await supabase
        .from('journal_entries')
        .select(`
          id,
          date,
          morning_completed,
          evening_completed,
          gratitude_action_completed,
          total_points
        `)
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString());

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch entries');
    } finally {
      setLoading(false);
    }
  }

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const getEntryForDay = (day: Date) => {
    return entries.find(entry => isSameDay(new Date(entry.date), day));
  };

  return (
    <main className="history-container">
      <div className="header">
        <h1>Journal History</h1>
        <div className="view-toggle">
          <Link href="/history/list" className="view-button">List View</Link>
          <Link href="/history/calendar" className="view-button active">Calendar View</Link>
        </div>
      </div>

      <div className="calendar-header">
        <button
          onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
          className="month-nav"
        >
          ←
        </button>
        <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
        <button
          onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
          className="month-nav"
        >
          →
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading entries...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="calendar">
          <div className="weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          <div className="days">
            {days.map(day => {
              const entry = getEntryForDay(day);
              return (
                <div key={day.toISOString()} className="day">
                  <span className="date">{format(day, 'd')}</span>
                  {entry && (
                    <div className="day-content">
                      <div className="completion-indicators">
                        {entry.morning_completed && (
                          <span className="indicator morning" title="Morning Journal">🌅</span>
                        )}
                        {entry.evening_completed && (
                          <span className="indicator evening" title="Evening Journal">🌙</span>
                        )}
                        {entry.gratitude_action_completed && (
                          <span className="indicator gratitude" title="Gratitude Action">💝</span>
                        )}
                      </div>
                      <div className="points" title="Points earned">
                        {entry.total_points}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 0 1rem;
        }

        .calendar-header h2 {
          font-size: 1.5rem;
          font-weight: 500;
          color: rgb(240, 240, 240);
        }

        .month-nav {
          background: none;
          border: none;
          color: rgb(200, 200, 200);
          font-size: 1.5rem;
          padding: 0.5rem 1rem;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .month-nav:hover {
          color: rgb(255, 200, 120);
        }

        .loading,
        .error {
          text-align: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          color: rgb(200, 200, 200);
        }

        .error {
          color: rgb(255, 100, 100);
        }

        .calendar {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          overflow: hidden;
        }

        .weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem 0;
        }

        .weekday {
          text-align: center;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgb(180, 180, 180);
        }

        .days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          background: rgba(255, 255, 255, 0.05);
        }

        .day {
          aspect-ratio: 1;
          padding: 0.5rem;
          background: rgba(0, 0, 0, 0.2);
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .date {
          font-size: 0.875rem;
          color: rgb(180, 180, 180);
          margin-bottom: 0.5rem;
        }

        .day-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .completion-indicators {
          display: flex;
          gap: 0.25rem;
          flex-wrap: wrap;
        }

        .indicator {
          font-size: 0.75rem;
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }

        .indicator:hover {
          opacity: 1;
        }

        .points {
          font-size: 0.75rem;
          color: rgb(255, 200, 120);
          background: rgba(255, 200, 120, 0.2);
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          align-self: flex-end;
          margin-top: 0.25rem;
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

          .calendar-header {
            padding: 0;
          }

          .calendar-header h2 {
            font-size: 1.25rem;
          }

          .month-nav {
            padding: 0.5rem;
          }

          .weekday {
            font-size: 0.75rem;
          }

          .date {
            font-size: 0.75rem;
          }

          .indicator {
            font-size: 0.625rem;
          }

          .points {
            font-size: 0.625rem;
          }
        }
      `}</style>
    </main>
  );
}
