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
    // Use a module-level variable to track dev session
    const getDevSession = () => {
      if (typeof window === 'undefined') return null;
      const saved = window.localStorage.getItem('devSession');
      return saved ? JSON.parse(saved) : null;
    };

    const setDevSession = (session: DevSession | null) => {
      if (typeof window === 'undefined') return;
      if (session) {
        window.localStorage.setItem('devSession', JSON.stringify(session));
      } else {
        window.localStorage.removeItem('devSession');
      }
    };

    let listeners: ((event: string, session: DevSession | null) => void)[] = [];
    let devSession = getDevSession();

    // Initialize session if none exists
    if (!devSession) {
      devSession = {
        user: DEV_USER,
        access_token: 'fake-token',
        refresh_token: 'fake-refresh-token'
      };
      setDevSession(devSession);
    }

    return {
      ...client,
      auth: {
        ...client.auth,
        getUser: async () => ({ data: { user: getDevSession()?.user || null }, error: null }),
        getSession: async () => ({ data: { session: getDevSession() }, error: null }),
        signInWithOtp: async ({ email }: { email: string }) => {
          if (email === 'dev@gynergy.app') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            devSession = {
              user: DEV_USER,
              access_token: 'fake-token',
              refresh_token: 'fake-refresh-token'
            };
            setDevSession(devSession);
            listeners.forEach(listener => listener('SIGNED_IN', devSession));
            return { data: { user: DEV_USER }, error: null };
          }
          return client.auth.signInWithOtp({ email });
        },
        signOut: async () => {
          devSession = null;
          setDevSession(null);
          listeners.forEach(listener => listener('SIGNED_OUT', null));
          return { error: null };
        },
        onAuthStateChange: (callback: (event: string, session: DevSession | null) => void) => {
          listeners.push(callback);
          // Immediately call with current session
          callback('INITIAL', getDevSession());
          return {
            data: { subscription: { unsubscribe: () => {
              listeners = listeners.filter(l => l !== callback);
            }}},
            error: null
          };
        },
        exchangeCodeForSession: async () => ({ 
          data: { session: getDevSession() }, 
          error: null 
        }),
        updateUser: async (attributes: { data: Record<string, any> }) => {
          const session = getDevSession();
          if (session?.user) {
            session.user.user_metadata = {
              ...session.user.user_metadata,
              ...attributes.data
            };
            setDevSession(session);
            return { data: { user: session.user }, error: null };
          }
          return { data: { user: null }, error: new Error('No user session') };
        }
      },
      from: client.from.bind(client),
      rpc: client.rpc.bind(client),
      channel: client.channel.bind(client),
      realtime: client.realtime
    };
  }

  return client;
} 