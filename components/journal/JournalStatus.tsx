'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import Link from 'next/link';

interface JournalStatusProps {
  type: 'morning' | 'evening';
}

interface JournalEntry {
  id: string;
  morning_completed: boolean;
  evening_completed: boolean;
  morning_points: number;
  evening_points: number;
}

interface JournalStatus {
  morning_completed: boolean;
  evening_completed: boolean;
  gratitude_action_completed: boolean;
}

export function CompletionBadge({ completed }: { completed: boolean }) {
  if (!completed) return null;
  
  return (
    <div className="completion-badge">
      <span className="checkmark">✓</span>
      <style jsx>{`
        .completion-badge {
          position: absolute;
          top: -10px;
          right: -10px;
          background: rgb(255, 200, 120);
          color: rgb(32, 32, 32);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
          box-shadow: 
            0 2px 8px rgba(255, 200, 120, 0.3),
            0 0 0 2px rgba(255, 200, 120, 0.1);
          animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .checkmark {
          transform: translateY(-1px);
        }

        @keyframes pop {
          0% {
            transform: scale(0);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export function useJournalStatus() {
  const [status, setStatus] = useState<JournalStatus>({
    morning_completed: false,
    evening_completed: false,
    gratitude_action_completed: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const supabase = createClient();
        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
          .from('journal_entries')
          .select('morning_completed, evening_completed, gratitude_action_completed')
          .eq('date', today)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.error('Error fetching journal status:', error);
          return;
        }

        if (data) {
          setStatus(data);
        }
      } catch (error) {
        console.error('Error fetching journal status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    // Subscribe to realtime updates
    const supabase = createClient();
    const channel = supabase
      .channel('journal_status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'journal_entries',
          filter: `date=eq.${new Date().toISOString().split('T')[0]}`
        },
        (payload) => {
          const { new: newData } = payload as any;
          if (newData) {
            setStatus({
              morning_completed: newData.morning_completed,
              evening_completed: newData.evening_completed,
              gratitude_action_completed: newData.gratitude_action_completed
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { status, loading };
}

export function JournalStatus({ type }: JournalStatusProps) {
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJournalStatus() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('journal_entries')
          .select('id, morning_completed, evening_completed, morning_points, evening_points')
          .eq('date', new Date().toISOString().split('T')[0])
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching journal status:', error);
          setError(error.message);
          return;
        }

        setEntry(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to fetch journal status');
      } finally {
        setLoading(false);
      }
    }

    fetchJournalStatus();
  }, []);

  const isCompleted = type === 'morning' ? entry?.morning_completed : entry?.evening_completed;
  const points = type === 'morning' ? entry?.morning_points : entry?.evening_points;
  const title = type === 'morning' ? 'Morning Journal' : 'Evening Journal';
  const description = type === 'morning'
    ? 'Start your day with intention'
    : 'Reflect on your day';

  if (loading) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
        
        <div className="mt-4">
          {isCompleted ? (
            <div className="flex items-center text-green-600">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Completed (+{points} points)</span>
            </div>
          ) : (
            <Link 
              href={`/journal/${type}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start {type} journal
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 