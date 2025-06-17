export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      exercises: {
        Row: {
          created_at: string | null
          id: string
          name: string
          reps: number
          sets: number
          training_id: string
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          reps: number
          sets: number
          training_id: string
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          reps?: number
          sets?: number
          training_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
        ]
      }
      planned_trainings: {
        Row: {
          completed: boolean | null
          completed_training_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          planned_date: string
          planned_distance: number | null
          planned_duration: number | null
          title: string
          type: Database["public"]["Enums"]["training_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_training_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          planned_date: string
          planned_distance?: number | null
          planned_duration?: number | null
          title: string
          type: Database["public"]["Enums"]["training_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_training_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          planned_date?: string
          planned_distance?: number | null
          planned_duration?: number | null
          title?: string
          type?: Database["public"]["Enums"]["training_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planned_trainings_completed_training_id_fkey"
            columns: ["completed_training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          activity_level: Database["public"]["Enums"]["activity_level"] | null
          created_at: string | null
          date_of_birth: string | null
          first_name: string | null
          goals: string | null
          height: number | null
          id: string
          last_name: string | null
          strava_connected: boolean | null
          strava_user_id: string | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          activity_level?: Database["public"]["Enums"]["activity_level"] | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          goals?: string | null
          height?: number | null
          id: string
          last_name?: string | null
          strava_connected?: boolean | null
          strava_user_id?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          activity_level?: Database["public"]["Enums"]["activity_level"] | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          goals?: string | null
          height?: number | null
          id?: string
          last_name?: string | null
          strava_connected?: boolean | null
          strava_user_id?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      trainings: {
        Row: {
          calories: number | null
          created_at: string | null
          date: string
          distance: number | null
          duration: number
          heart_rate_avg: number | null
          heart_rate_max: number | null
          id: string
          notes: string | null
          pace: string | null
          title: string
          type: Database["public"]["Enums"]["training_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          created_at?: string | null
          date: string
          distance?: number | null
          duration: number
          heart_rate_avg?: number | null
          heart_rate_max?: number | null
          id?: string
          notes?: string | null
          pace?: string | null
          title: string
          type: Database["public"]["Enums"]["training_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          calories?: number | null
          created_at?: string | null
          date?: string
          distance?: number | null
          duration?: number
          heart_rate_avg?: number | null
          heart_rate_max?: number | null
          id?: string
          notes?: string | null
          pace?: string | null
          title?: string
          type?: Database["public"]["Enums"]["training_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_level: "beginner" | "intermediate" | "advanced" | "elite"
      training_type:
        | "running"
        | "cycling"
        | "swimming"
        | "strength"
        | "yoga"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_level: ["beginner", "intermediate", "advanced", "elite"],
      training_type: [
        "running",
        "cycling",
        "swimming",
        "strength",
        "yoga",
        "other",
      ],
    },
  },
} as const
