'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';

interface DailyAction {
  id: string;
  action_text: string;
  tip_text: string;
}

interface JournalEntry {
  id: string;
  gratitude_action_completed: boolean;
  gratitude_action_points: number;
}

export function DailyAction() {
  const [action, setAction] = useState<DailyAction | null>(null);
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDailyAction() {
      try {
        const supabase = createClient();
        
        // Fetch today's action
        const { data: actionData, error: actionError } = await supabase
          .from('daily_actions')
          .select('*')
          .limit(1)
          .single();

        if (actionError) {
          console.error('Error fetching daily action:', actionError);
          setError(actionError.message);
          return;
        }

        setAction(actionData);

        // Fetch journal entry to check if action is completed
        const { data: entryData, error: entryError } = await supabase
          .from('journal_entries')
          .select('id, gratitude_action_completed, gratitude_action_points')
          .eq('date', new Date().toISOString().split('T')[0])
          .single();

        if (entryError && entryError.code !== 'PGRST116') {
          console.error('Error fetching journal entry:', entryError);
          setError(entryError.message);
          return;
        }

        setEntry(entryData);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to fetch daily action');
      } finally {
        setLoading(false);
      }
    }

    fetchDailyAction();
  }, []);

  if (loading) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
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
          <h3 className="text-lg font-medium text-gray-900">Daily Gratitude Action</h3>
          <p className="mt-1 text-sm text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!action) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Daily Gratitude Action</h3>
          <p className="mt-1 text-sm text-gray-500">No action available for today</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Daily Gratitude Action</h3>
        <p className="mt-1 text-sm text-gray-500">{action.action_text}</p>
        <p className="mt-2 text-xs text-gray-400 italic">{action.tip_text}</p>
        
        <div className="mt-4">
          {entry?.gratitude_action_completed ? (
            <div className="flex items-center text-green-600">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Completed (+{entry.gratitude_action_points} points)</span>
            </div>
          ) : (
            <button 
              onClick={async () => {
                try {
                  const supabase = createClient();
                  const { error } = await supabase
                    .from('journal_entries')
                    .update({ 
                      gratitude_action_completed: true,
                      gratitude_action_points: 10
                    })
                    .eq('date', new Date().toISOString().split('T')[0]);

                  if (error) throw error;

                  setEntry(prev => prev ? {
                    ...prev,
                    gratitude_action_completed: true,
                    gratitude_action_points: 10
                  } : null);
                } catch (err) {
                  console.error('Error completing action:', err);
                  setError('Failed to complete action');
                }
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Complete action
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 