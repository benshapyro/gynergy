import { createBrowserClient } from '@supabase/ssr'
import { User, Session } from '@supabase/supabase-js'

// For development only - remove in production
const DEV_USER: User = {
  id: 'a1b2c3d4-e5f6-4321-8901-abcdef123456', // Valid UUID format
  app_metadata: {},
  user_metadata: { 
    first_name: 'Ben',
    last_name: 'Shapiro',
    onboarded: false // Set to false to test onboarding flow
  },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'dev@gynergy.app', // Use this email to trigger dev mode
  phone: '619-218-3483',
  role: 'authenticated',
  updated_at: new Date().toISOString(),
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
  phone_confirmed_at: undefined,
  factors: undefined,
  identities: []
};

type DevSession = {
  user: User;
  access_token: string;
  refresh_token: string;
};

export function createClient() {
  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // For development only - remove in production
  if (process.env.NODE_ENV === 'development') {
    let listeners: ((event: string, session: DevSession | null) => void)[] = [];
    let devSession: DevSession | null = null;

    return {
      ...client,
      auth: {
        ...client.auth,
        // Simulate getting current user
        getUser: async () => ({ data: { user: devSession?.user || null }, error: null }),
        // Simulate getting current session
        getSession: async () => ({ data: { session: devSession }, error: null }),
        // Simulate magic link sign in
        signInWithOtp: async ({ email }: { email: string }) => {
          // Only auto-sign in with dev email
          if (email === 'dev@gynergy.app') {
            // Simulate a delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Create dev session
            devSession = {
              user: DEV_USER,
              access_token: 'fake-token',
              refresh_token: 'fake-refresh-token'
            };

            // Notify listeners of sign in
            listeners.forEach(listener => listener('SIGNED_IN', devSession));
            
            return { data: { user: DEV_USER }, error: null };
          }
          
          // For other emails, use real Supabase client
          return client.auth.signInWithOtp({ email });
        },
        // Simulate sign out
        signOut: async () => {
          devSession = null;
          listeners.forEach(listener => listener('SIGNED_OUT', null));
          return { error: null };
        },
        // Handle auth state changes
        onAuthStateChange: (callback: (event: string, session: DevSession | null) => void) => {
          listeners.push(callback);
          return {
            data: { subscription: { unsubscribe: () => {
              listeners = listeners.filter(l => l !== callback);
            }}},
            error: null
          };
        },
        // Simulate code exchange
        exchangeCodeForSession: async () => ({ 
          data: { session: devSession }, 
          error: null 
        }),
        // Update user metadata
        updateUser: async (attributes: { data: Record<string, any> }) => {
          if (devSession?.user) {
            devSession.user.user_metadata = {
              ...devSession.user.user_metadata,
              ...attributes.data
            };
            return { data: { user: devSession.user }, error: null };
          }
          return { data: { user: null }, error: new Error('No user session') };
        }
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