export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      journal_entries: {
        Row: {
          id: string  // uuid
          user_id: string | null  // uuid, nullable
          date: string  // date
          morning_completed: boolean | null
          morning_mood_score: number | null  // integer
          morning_mood_factors: string[] | null  // array
          morning_reflection: string | null  // text
          morning_points: number | null  // integer
          evening_completed: boolean | null
          evening_mood_score: number | null  // integer
          evening_mood_factors: string[] | null  // array
          evening_reflection: string | null  // text
          evening_points: number | null  // integer
          gratitude_action_completed: boolean | null
          gratitude_action_points: number | null  // integer
          total_points: number | null  // integer
          created_at: string | null  // timestamptz
          updated_at: string | null  // timestamptz
        }
        Insert: {
          id?: string  // uuid
          user_id?: string | null  // uuid
          date: string  // date
          morning_completed?: boolean | null
          morning_mood_score?: number | null
          morning_mood_factors?: string[] | null
          morning_reflection?: string | null
          morning_points?: number | null
          evening_completed?: boolean | null
          evening_mood_score?: number | null
          evening_mood_factors?: string[] | null
          evening_reflection?: string | null
          evening_points?: number | null
          gratitude_action_completed?: boolean | null
          gratitude_action_points?: number | null
          total_points?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string  // uuid
          user_id?: string | null  // uuid
          date?: string  // date
          morning_completed?: boolean | null
          morning_mood_score?: number | null
          morning_mood_factors?: string[] | null
          morning_reflection?: string | null
          morning_points?: number | null
          evening_completed?: boolean | null
          evening_mood_score?: number | null
          evening_mood_factors?: string[] | null
          evening_reflection?: string | null
          evening_points?: number | null
          gratitude_action_completed?: boolean | null
          gratitude_action_points?: number | null
          total_points?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
