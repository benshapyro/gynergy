import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// For development only - remove in production
const DEV_USER = {
  id: 'test-user-123',
  email: 'test@example.com',
  user_metadata: {
    name: 'Test User'
  }
};

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie errors
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookie errors
          }
        },
      },
    }
  )
}

export function createServerSupabase() {
  const cookieStore = cookies()

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie errors
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookie errors
          }
        },
      },
    }
  )

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
      }
    }
  }

  return client
} 