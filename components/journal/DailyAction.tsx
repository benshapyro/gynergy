'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';

interface Action {
  id: string;
  action_text: string;
  tip_text: string;
}

interface ActionResponse {
  action_completed: boolean;
  morning_reflection: string | null;
  evening_reflection: string | null;
}

export function DailyAction() {
  const [action, setAction] = useState<Action | null>(null);
  const [response, setResponse] = useState<ActionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDailyAction() {
      const supabase = createClient();
      const today = new Date().toISOString().split('T')[0];

      // Fetch today's action
      const { data: actionData, error: actionError } = await supabase
        .from('daily_actions')
        .select('id, action_text, tip_text')
        .eq('active_date', today)
        .single();

      if (actionError) {
        console.error('Error fetching daily action:', actionError);
        setLoading(false);
        return;
      }

      setAction(actionData);

      // Fetch user's response if it exists
      if (actionData) {
        const { data: responseData, error: responseError } = await supabase
          .from('gratitude_action_responses')
          .select('action_completed, morning_reflection, evening_reflection')
          .eq('journal_entry_id', actionData.id)
          .single();

        if (responseError && responseError.code !== 'PGRST116') {
          console.error('Error fetching action response:', responseError);
        } else {
          setResponse(responseData);
        }
      }

      setLoading(false);
    }

    fetchDailyAction();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!action) return null;

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Today's Gratitude Action</h3>
        
        <div className="mt-4">
          <p className="text-gray-900">{action.action_text}</p>
          {action.tip_text && (
            <p className="mt-2 text-sm text-gray-500">💡 Tip: {action.tip_text}</p>
          )}
        </div>

        {response?.action_completed ? (
          <div className="mt-4">
            <div className="flex items-center text-green-600">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Completed (+10 points)</span>
            </div>
            {response.morning_reflection && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Morning reflection:</p>
                <p className="text-gray-700">{response.morning_reflection}</p>
              </div>
            )}
            {response.evening_reflection && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Evening reflection:</p>
                <p className="text-gray-700">{response.evening_reflection}</p>
              </div>
            )}
          </div>
        ) : (
          <button
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => {/* TODO: Open gratitude action form */}}
          >
            Start gratitude action
          </button>
        )}
      </div>
    </div>
  );
} 