import { createBrowserClient } from '@supabase/ssr'

// For development only - remove in production
const DEV_USER = {
  id: 'test-user-123',
  email: 'test@example.com',
  user_metadata: {
    name: 'Test User'
  }
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
        })
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