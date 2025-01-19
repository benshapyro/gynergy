import { createBrowserClient } from '@supabase/ssr'
import { User } from '@supabase/supabase-js'

// For development only - remove in production
const DEV_USER: User = {
  id: 'a1b2c3d4-e5f6-4321-8901-abcdef123456', // Valid UUID format
  app_metadata: {},
  user_metadata: { name: 'Test User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'test@example.com',
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
  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // For development only - remove in production
  if (process.env.NODE_ENV === 'development') {
    return {
      ...client,
      auth: {
        ...client.auth,
        getUser: async () => ({ data: { user: DEV_USER }, error: null }),
        getSession: async () => ({ 
          data: { 
            session: {
              user: DEV_USER,
              access_token: 'fake-token',
              refresh_token: 'fake-refresh-token'
            }
          }, 
          error: null 
        }),
        signInWithOtp: async () => ({ data: { user: DEV_USER }, error: null }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: client.auth.onAuthStateChange.bind(client.auth),
        exchangeCodeForSession: async () => ({ data: { session: { user: DEV_USER } }, error: null })
      },
      // Preserve all other client methods
      from: client.from.bind(client),
      rpc: client.rpc.bind(client),
      channel: client.channel.bind(client),
      realtime: client.realtime
    };
  }

  return client;
} 