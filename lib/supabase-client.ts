import { createBrowserClient } from '@supabase/ssr'
import { User, AuthChangeEvent, Session, PostgrestSingleResponse } from '@supabase/supabase-js'
import { Database } from './database.types'

// Add type definitions at the top of the file
type JournalEntry = Database['public']['Tables']['journal_entries']['Row'];
type MockResponse = PostgrestSingleResponse<JournalEntry[]>;

interface MockData {
  journal_entries: JournalEntry[];
}

// Add type for user metadata
interface UserMetadata {
  first_name: string;
  last_name: string;
  name: string;
  total_points: number;
  streak_count: number;
  [key: string]: string | number; // Allow string indexing
}

interface MockUser {
  id: string;
  raw_user_meta_data: UserMetadata;
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

// Create mock users for the leaderboard
const mockUsers: MockUser[] = [
  {
    id: '23d87cb8-e7ff-4852-a7ed-80f48093f99c',
    raw_user_meta_data: {
      first_name: 'Ben',
      last_name: 'Shapiro',
      name: 'Ben Shapiro',
      total_points: 120,
      streak_count: 7
    }
  },
  {
    id: 'mock-user-1',
    raw_user_meta_data: {
      first_name: 'Alice',
      last_name: 'Johnson',
      name: 'Alice Johnson',
      total_points: 150,
      streak_count: 5
    }
  },
  {
    id: 'mock-user-2',
    raw_user_meta_data: {
      first_name: 'Bob',
      last_name: 'Smith',
      name: 'Bob Smith',
      total_points: 90,
      streak_count: 3
    }
  },
  {
    id: 'mock-user-3',
    raw_user_meta_data: {
      first_name: 'Carol',
      last_name: 'Williams',
      name: 'Carol Williams',
      total_points: 200,
      streak_count: 10
    }
  },
  {
    id: 'mock-user-4',
    raw_user_meta_data: {
      first_name: 'David',
      last_name: 'Brown',
      name: 'David Brown',
      total_points: 75,
      streak_count: 2
    }
  }
];

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
        signUp: async ({ email, password, options }: { 
          email: string; 
          password: string;
          options?: { data?: Record<string, any> }
        }) => {
          // Create a user with the provided email and metadata
          const mockUser = { 
            ...DEV_USER, 
            email,
            user_metadata: options?.data || {}
          };
          const mockSession = createMockSession(mockUser);

          // Trigger auth state change immediately
          setTimeout(() => {
            authCallbacks.forEach(cb => cb('INITIAL_SESSION', mockSession));
          }, 100);

          return { data: { user: mockUser, session: mockSession }, error: null };
        },
        signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
          // Create a user with the provided email
          const mockUser = { ...DEV_USER, email };
          const mockSession = createMockSession(mockUser);

          // Trigger auth state change immediately
          setTimeout(() => {
            authCallbacks.forEach(cb => cb('SIGNED_IN', mockSession));
          }, 100);

          return { data: { user: mockUser, session: mockSession }, error: null };
        },
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
      channel: (name: string) => {
        console.log('Creating mock channel:', name);
        const channelInstance = {
          on: (event: string, config: any, callback?: Function) => {
            console.log('Subscribing to event:', event, 'with config:', config);
            return channelInstance;
          },
          subscribe: async () => {
            console.log('Mock subscription created');
            return channelInstance;
          },
          unsubscribe: async () => {
            console.log('Mock unsubscribe called');
            return channelInstance;
          }
        };
        return channelInstance;
      },
      from: (table: string) => {
        const baseQuery = client.from(table);
        
        // Track query state
        let queryState = {
          filters: {} as Record<string, any>,
          orderBy: null as { column: string; ascending: boolean } | null,
          limitTo: null as number | null
        };
        
        // Create chainable query builder
        const builder = {
          select: (query?: string) => {
            const enhanced = {
              ...builder,
              eq: (column: string, value: any) => {
                queryState.filters[column] = value;
                return enhanced;
              },
              gte: (column: string, value: any) => {
                queryState.filters[`${column}_gte`] = value;
                return enhanced;
              },
              lte: (column: string, value: any) => {
                queryState.filters[`${column}_lte`] = value;
                return enhanced;
              },
              order: (column: string, { ascending = true } = {}) => {
                queryState.orderBy = { column, ascending };
                return enhanced;
              },
              limit: (n: number) => {
                queryState.limitTo = n;
                return enhanced;
              },
              then: async (resolve: any) => {
                if (process.env.NODE_ENV === 'development') {
                  console.log('Mock query state:', { table, queryState });
                  
                  // Handle auth.users table
                  if (table === 'auth.users') {
                    let filteredData = [...mockUsers];
                    
                    // Apply ordering for user metadata
                    if (queryState.orderBy) {
                      const { column, ascending } = queryState.orderBy;
                      if (column.startsWith('raw_user_meta_data->')) {
                        const field = column.replace('raw_user_meta_data->', '') as keyof UserMetadata;
                        filteredData.sort((a, b) => {
                          const aVal = a.raw_user_meta_data[field];
                          const bVal = b.raw_user_meta_data[field];
                          if (ascending) {
                            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
                          } else {
                            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
                          }
                        });
                      }
                    }

                    // Apply limit
                    if (queryState.limitTo !== null) {
                      filteredData = filteredData.slice(0, queryState.limitTo);
                    }
                    
                    console.log('Returning mock users:', filteredData);
                    return resolve({
                      data: filteredData,
                      error: null,
                      count: null,
                      status: 200,
                      statusText: 'OK'
                    });
                  }
                  
                  // Handle journal_entries table
                  let filteredData = [...mockJournalEntries];
                  
                  // Apply filters
                  Object.entries(queryState.filters).forEach(([key, value]) => {
                    if (key.endsWith('_gte')) {
                      const field = key.replace('_gte', '') as keyof JournalEntry;
                      filteredData = filteredData.filter(entry => 
                        entry[field] !== null && 
                        (entry[field] as any) >= value
                      );
                    } else if (key.endsWith('_lte')) {
                      const field = key.replace('_lte', '') as keyof JournalEntry;
                      filteredData = filteredData.filter(entry => 
                        entry[field] !== null && 
                        (entry[field] as any) <= value
                      );
                    } else {
                      const field = key as keyof JournalEntry;
                      filteredData = filteredData.filter(entry => 
                        entry[field] === value
                      );
                    }
                  });
                  
                  // Apply ordering
                  if (queryState.orderBy) {
                    const { column, ascending } = queryState.orderBy;
                    const field = column as keyof JournalEntry;
                    filteredData.sort((a, b) => {
                      const aVal = a[field];
                      const bVal = b[field];
                      
                      // Handle null values in sorting
                      if (aVal === null && bVal === null) return 0;
                      if (aVal === null) return ascending ? 1 : -1;
                      if (bVal === null) return ascending ? -1 : 1;
                      
                      // Compare non-null values
                      if (ascending) {
                        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
                      } else {
                        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
                      }
                    });
                  }

                  // Apply limit
                  if (queryState.limitTo !== null) {
                    filteredData = filteredData.slice(0, queryState.limitTo);
                  }
                  
                  return resolve({
                    data: filteredData,
                    error: null,
                    count: null,
                    status: 200,
                    statusText: 'OK'
                  });
                }
                return (baseQuery as any).then(resolve);
              }
            };
            return enhanced;
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
        
        return builder;
      }
    };

    return mockClient;
  }

  return client;
}