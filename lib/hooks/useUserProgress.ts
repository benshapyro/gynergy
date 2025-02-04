import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

interface UserProgress {
  total_points: number;
  streak_count: number;
  loading: boolean;
  error: string | null;
}

export function useUserProgress(): UserProgress {
  const [progress, setProgress] = useState<UserProgress>({
    total_points: 0,
    streak_count: 0,
    loading: true,
    error: null
  });

  const supabase = createClient() as SupabaseClient<Database>;

  useEffect(() => {
    let mounted = true;

    async function fetchUserProgress() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        if (!user) throw new Error('No user found');

        // Get user metadata which includes points and streak
        const total_points = user.user_metadata?.total_points || 0;
        const streak_count = user.user_metadata?.streak_count || 0;

        if (mounted) {
          setProgress({
            total_points,
            streak_count,
            loading: false,
            error: null
          });
        }

      } catch (err) {
        if (mounted) {
          setProgress(prev => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : 'An error occurred'
          }));
        }
      }
    }

    // Initial fetch
    fetchUserProgress();

    // Subscribe to realtime changes
    const channel = supabase.channel('user-progress');
    
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'auth',
          table: 'users'
        },
        async () => {
          // Refetch user data when changes occur
          if (mounted) {
            await fetchUserProgress();
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      channel.unsubscribe();
    };
  }, [supabase]);

  return progress;
} 