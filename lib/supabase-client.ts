import { createBrowserClient } from '@supabase/ssr'
import { User, AuthChangeEvent, Session, PostgrestSingleResponse } from '@supabase/supabase-js'
import { Database } from './database.types'

// Add type definitions at the top of the file
type JournalEntry = Database['public']['Tables']['journal_entries']['Row'];
type MockResponse = PostgrestSingleResponse<JournalEntry[]>;

interface MockData {
  journal_entries: JournalEntry[];
}

// For development only - remove in production
const DEV_USER: User = {
  id: '23d87cb8-e7ff-4852-a7ed-80f48093f99c',
  app_metadata: {},
  user_metadata: { 
    first_name: 'Ben',
    last_name: 'Shapiro',
    name: 'Ben Shapiro',
    onboarded: true,
    total_points: 120,
    streak_count: 7
  },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'benshapyro@gmail.com',
  phone: '',
  role: 'authenticated',
  updated_at: new Date().toISOString(),
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
  phone_confirmed_at: undefined,
  factors: undefined,
  identities: []
};

export function createClient() {
  const client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // For development only - remove in production
  if (process.env.NODE_ENV === 'development') {
    // Create a mock session
    const createMockSession = (user: User): Session => ({
      user,
      access_token: 'fake-token',
      refresh_token: 'fake-refresh-token',
      expires_at: new Date(Date.now() + 3600 * 1000).getTime(),
      expires_in: 3600,
      token_type: 'bearer'
    });

    // Store auth callbacks
    const authCallbacks: ((event: AuthChangeEvent, session: Session | null) => void)[] = [];

    // Create mock data for February 2025
    const mockJournalEntries: JournalEntry[] = [
      {
        id: 'mock-1',
        user_id: DEV_USER.id,
        date: '2025-02-04',
        morning_completed: true,
        morning_mood_score: 8,
        morning_mood_factors: ['SLEEP', 'EXERCISE'],
        morning_reflection: 'Had a great morning routine!',
        morning_points: 10,
        evening_completed: true,
        evening_mood_score: 9,
        evening_mood_factors: ['PRODUCTIVITY', 'SOCIAL'],
        evening_reflection: 'Productive day with good social interactions',
        evening_points: 10,
        gratitude_action_completed: true,
        gratitude_action_points: 5,
        total_points: 25,
        created_at: '2025-02-04T08:00:00.000Z',
        updated_at: '2025-02-04T20:00:00.000Z'
      },
      {
        id: 'mock-2',
        user_id: DEV_USER.id,
        date: '2025-02-03',
        morning_completed: true,
        morning_mood_score: 7,
        morning_mood_factors: ['SLEEP'],
        morning_reflection: 'Decent morning start',
        morning_points: 10,
        evening_completed: true,
        evening_mood_score: 8,
        evening_mood_factors: ['PRODUCTIVITY'],
        evening_reflection: 'Got a lot done today',
        evening_points: 10,
        gratitude_action_completed: true,
        gratitude_action_points: 5,
        total_points: 25,
        created_at: '2025-02-03T08:00:00.000Z',
        updated_at: '2025-02-03T20:00:00.000Z'
      },
      {
        id: 'mock-3',
        user_id: DEV_USER.id,
        date: '2025-02-02',
        morning_completed: true,
        morning_mood_score: 9,
        morning_mood_factors: ['SLEEP', 'EXERCISE', 'NUTRITION'],
        morning_reflection: 'Amazing start to the day!',
        morning_points: 10,
        evening_completed: true,
        evening_mood_score: 8,
        evening_mood_factors: ['PRODUCTIVITY', 'SOCIAL', 'HOBBIES'],
        evening_reflection: 'Great balance of work and fun',
        evening_points: 10,
        gratitude_action_completed: true,
        gratitude_action_points: 5,
        total_points: 25,
        created_at: '2025-02-02T08:00:00.000Z',
        updated_at: '2025-02-02T20:00:00.000Z'
      },
      {
        id: 'mock-4',
        user_id: DEV_USER.id,
        date: '2025-02-01',
        morning_completed: true,
        morning_mood_score: 8,
        morning_mood_factors: ['SLEEP', 'MEDITATION'],
        morning_reflection: 'Started with meditation, feeling centered',
        morning_points: 10,
        evening_completed: true,
        evening_mood_score: 9,
        evening_mood_factors: ['PRODUCTIVITY', 'LEARNING'],
        evening_reflection: 'Learned some new things today',
        evening_points: 10,
        gratitude_action_completed: true,
        gratitude_action_points: 5,
        total_points: 25,
        created_at: '2025-02-01T08:00:00.000Z',
        updated_at: '2025-02-01T20:00:00.000Z'
      }
    ];

    // Create a mock client that wraps the real client
    const mockClient = {
      ...client,
      auth: {
        getUser: async () => ({ data: { user: DEV_USER }, error: null }),
        getSession: async () => ({ 
          data: { session: createMockSession(DEV_USER) }, 
          error: null 
        }),
        signInWithOtp: async ({ email }: { email: string }) => {
          // Create a user with the provided email
          const mockUser = { ...DEV_USER, email };
          const mockSession = createMockSession(mockUser);

          // Trigger auth state change immediately
          setTimeout(() => {
            authCallbacks.forEach(cb => cb('SIGNED_IN', mockSession));
          }, 100);

          return { data: { user: mockUser }, error: null };
        },
        signOut: async () => {
          // Trigger auth state change
          authCallbacks.forEach(cb => cb('SIGNED_OUT', null));
          return { error: null };
        },
        onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
          // Store callback
          authCallbacks.push(callback);
          
          // Return mock subscription
          return {
            data: { 
              subscription: {
                unsubscribe: () => {
                  const index = authCallbacks.indexOf(callback);
                  if (index > -1) {
                    authCallbacks.splice(index, 1);
                  }
                }
              }
            },
            error: null
          };
        }
      },
      from: (table: string) => {
        const baseQuery = client.from(table);
        
        // Enhance the query builder with user context
        const enhancedQuery = {
          ...baseQuery,
          select: (query?: string) => {
            let queryBuilder = baseQuery.select(query);
            
            // Add user_id filter for tables that need it
            if (['journal_entries', 'affirmations', 'gratitude_excitement', 'free_flow', 'dream_magic'].includes(table)) {
              console.log('Adding user_id filter for table:', table);
              queryBuilder = queryBuilder.eq('user_id', DEV_USER.id);
            }
            
            // Wrap the query execution to inject mock data
            const wrappedQuery = {
              ...queryBuilder,
              eq: (column: string, value: any) => {
                console.log(`Adding filter: ${column} = ${value}`);
                console.log('Current query state:', queryBuilder);
                const newQuery = wrappedQuery;
                queryBuilder = queryBuilder.eq(column, value);
                return newQuery;
              },
              gte: (column: string, value: any) => {
                console.log(`Adding filter: ${column} >= ${value}`);
                console.log('Current query state:', queryBuilder);
                const newQuery = wrappedQuery;
                queryBuilder = queryBuilder.gte(column, value);
                return newQuery;
              },
              lte: (column: string, value: any) => {
                console.log(`Adding filter: ${column} <= ${value}`);
                console.log('Current query state:', queryBuilder);
                const newQuery = wrappedQuery;
                queryBuilder = queryBuilder.lte(column, value);
                return newQuery;
              },
              then: (resolve: any) => {
                if (process.env.NODE_ENV === 'development' && table === 'journal_entries') {
                  console.log(`Returning mock data for ${table}`);
                  console.log('Final query state:', queryBuilder);
                  
                  // Get all the filters that have been applied
                  const filters = {
                    ...((queryBuilder as any).headers?.filter ?? {}),
                    eq: (queryBuilder as any).eq,
                    gte: (queryBuilder as any).gte,
                    lte: (queryBuilder as any).lte
                  };
                  console.log('All applied filters:', filters);
                  
                  // Filter mock data based on all conditions
                  let filteredData = mockJournalEntries;
                  
                  // Apply date filters if present
                  if (filters.gte?.date) {
                    console.log('Filtering by start date:', filters.gte.date);
                    filteredData = filteredData.filter(entry => entry.date >= filters.gte.date);
                  }
                  if (filters.lte?.date) {
                    console.log('Filtering by end date:', filters.lte.date);
                    filteredData = filteredData.filter(entry => entry.date <= filters.lte.date);
                  }
                  
                  console.log('Filtered data:', filteredData);
                  
                  return Promise.resolve(resolve({
                    data: filteredData,
                    error: null,
                    count: null,
                    status: 200,
                    statusText: 'OK'
                  }));
                }
                return queryBuilder.then(resolve);
              }
            };
            
            return wrappedQuery;
          },
          insert: (values: any) => {
            console.log(`Inserting into ${table}:`, values);
            // Automatically add user_id for tables that need it
            if (['journal_entries', 'affirmations', 'gratitude_excitement', 'free_flow', 'dream_magic'].includes(table)) {
              if (Array.isArray(values)) {
                values = values.map(v => ({ ...v, user_id: DEV_USER.id }));
              } else {
                values = { ...values, user_id: DEV_USER.id };
              }
            }
            return baseQuery.insert(values);
          },
          update: (values: any) => {
            console.log(`Updating ${table}:`, values);
            let queryBuilder = baseQuery.update(values);
            if (['journal_entries', 'affirmations', 'gratitude_excitement', 'free_flow', 'dream_magic'].includes(table)) {
              queryBuilder = queryBuilder.eq('user_id', DEV_USER.id);
            }
            return queryBuilder;
          },
          delete: () => {
            console.log(`Deleting from ${table}`);
            let queryBuilder = baseQuery.delete();
            if (['journal_entries', 'affirmations', 'gratitude_excitement', 'free_flow', 'dream_magic'].includes(table)) {
              queryBuilder = queryBuilder.eq('user_id', DEV_USER.id);
            }
            return queryBuilder;
          }
        };
        
        return enhancedQuery;
      }
    };

    return mockClient;
  }

  return client;
}