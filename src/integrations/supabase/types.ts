export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      application_documents: {
        Row: {
          application_id: string
          created_at: string | null
          document_category: string
          document_name: string
          file_path: string | null
          id: string
          is_uploaded: boolean | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          application_id: string
          created_at?: string | null
          document_category: string
          document_name: string
          file_path?: string | null
          id?: string
          is_uploaded?: boolean | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string | null
          document_category?: string
          document_name?: string
          file_path?: string | null
          id?: string
          is_uploaded?: boolean | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      application_status_history: {
        Row: {
          application_id: string
          changed_by: string
          changed_by_role: Database["public"]["Enums"]["user_role"]
          comment: string | null
          created_at: string | null
          id: string
          new_status: Database["public"]["Enums"]["application_status"]
          previous_status:
            | Database["public"]["Enums"]["application_status"]
            | null
        }
        Insert: {
          application_id: string
          changed_by: string
          changed_by_role: Database["public"]["Enums"]["user_role"]
          comment?: string | null
          created_at?: string | null
          id?: string
          new_status: Database["public"]["Enums"]["application_status"]
          previous_status?:
            | Database["public"]["Enums"]["application_status"]
            | null
        }
        Update: {
          application_id?: string
          changed_by?: string
          changed_by_role?: Database["public"]["Enums"]["user_role"]
          comment?: string | null
          created_at?: string | null
          id?: string
          new_status?: Database["public"]["Enums"]["application_status"]
          previous_status?:
            | Database["public"]["Enums"]["application_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "application_status_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      applications: {
        Row: {
          additional_notes: string | null
          amount: number
          annual_turnover: number | null
          any_suitable_bank: boolean | null
          applicant_name: string
          assigned_manager: string | null
          company: string
          created_at: string | null
          created_by: string
          created_by_role: Database["public"]["Enums"]["user_role"]
          document_checklist_complete: boolean | null
          email: string
          id: string
          jurisdiction: string | null
          lead_source: Database["public"]["Enums"]["lead_source"]
          license_type: Database["public"]["Enums"]["license_type"]
          mobile: string
          number_of_shareholders: number | null
          partner_id: string | null
          preferred_bank_1: string | null
          preferred_bank_2: string | null
          preferred_bank_3: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          updated_at: string | null
        }
        Insert: {
          additional_notes?: string | null
          amount?: number
          annual_turnover?: number | null
          any_suitable_bank?: boolean | null
          applicant_name: string
          assigned_manager?: string | null
          company: string
          created_at?: string | null
          created_by: string
          created_by_role: Database["public"]["Enums"]["user_role"]
          document_checklist_complete?: boolean | null
          email: string
          id?: string
          jurisdiction?: string | null
          lead_source: Database["public"]["Enums"]["lead_source"]
          license_type: Database["public"]["Enums"]["license_type"]
          mobile: string
          number_of_shareholders?: number | null
          partner_id?: string | null
          preferred_bank_1?: string | null
          preferred_bank_2?: string | null
          preferred_bank_3?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
        }
        Update: {
          additional_notes?: string | null
          amount?: number
          annual_turnover?: number | null
          any_suitable_bank?: boolean | null
          applicant_name?: string
          assigned_manager?: string | null
          company?: string
          created_at?: string | null
          created_by?: string
          created_by_role?: Database["public"]["Enums"]["user_role"]
          document_checklist_complete?: boolean | null
          email?: string
          id?: string
          jurisdiction?: string | null
          lead_source?: Database["public"]["Enums"]["lead_source"]
          license_type?: Database["public"]["Enums"]["license_type"]
          mobile?: string
          number_of_shareholders?: number | null
          partner_id?: string | null
          preferred_bank_1?: string | null
          preferred_bank_2?: string | null
          preferred_bank_3?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_assigned_manager_fkey"
            columns: ["assigned_manager"]
            isOneToOne: false
            referencedRelation: "managers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "applications_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author: string
          content: string
          customer_id: string
          id: string
          timestamp: string
        }
        Insert: {
          author: string
          content: string
          customer_id: string
          id?: string
          timestamp?: string
        }
        Update: {
          author?: string
          content?: string
          customer_id?: string
          id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          amount: number
          annual_turnover: number | null
          company: string
          created_at: string
          customer_notes: string | null
          document_checklist_complete: boolean | null
          email: string
          id: string
          jurisdiction: string | null
          lead_source: string
          license_type: string
          mobile: string
          name: string
          preferred_bank: string | null
          product_id: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number
          annual_turnover?: number | null
          company: string
          created_at?: string
          customer_notes?: string | null
          document_checklist_complete?: boolean | null
          email: string
          id?: string
          jurisdiction?: string | null
          lead_source: string
          license_type: string
          mobile: string
          name: string
          preferred_bank?: string | null
          product_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          annual_turnover?: number | null
          company?: string
          created_at?: string
          customer_notes?: string | null
          document_checklist_complete?: boolean | null
          email?: string
          id?: string
          jurisdiction?: string | null
          lead_source?: string
          license_type?: string
          mobile?: string
          name?: string
          preferred_bank?: string | null
          product_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string
          created_at: string
          customer_id: string
          file_path: string | null
          id: string
          is_mandatory: boolean
          is_uploaded: boolean
          name: string
          requires_license_type: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          customer_id: string
          file_path?: string | null
          id?: string
          is_mandatory?: boolean
          is_uploaded?: boolean
          name: string
          requires_license_type?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          customer_id?: string
          file_path?: string | null
          id?: string
          is_mandatory?: boolean
          is_uploaded?: boolean
          name?: string
          requires_license_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      logs: {
        Row: {
          component: string | null
          created_at: string
          id: string
          level: string | null
          message: string
          stack_trace: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          component?: string | null
          created_at?: string
          id?: string
          level?: string | null
          message: string
          stack_trace?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          component?: string | null
          created_at?: string
          id?: string
          level?: string | null
          message?: string
          stack_trace?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      managers: {
        Row: {
          assigned_partners: string[] | null
          created_at: string | null
          created_by: string | null
          id: string
          permissions: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_partners?: string[] | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          permissions?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_partners?: string[] | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          permissions?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "managers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "managers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      partners: {
        Row: {
          assigned_manager: string | null
          business_address: string | null
          commission_rate: number | null
          company_name: string | null
          created_at: string | null
          expected_monthly_clients: number | null
          id: string
          industry_specializations: Json | null
          partner_level: string | null
          services_provided: Json | null
          success_rate: number | null
          total_clients_count: number | null
          updated_at: string | null
          user_id: string
          years_experience: number | null
        }
        Insert: {
          assigned_manager?: string | null
          business_address?: string | null
          commission_rate?: number | null
          company_name?: string | null
          created_at?: string | null
          expected_monthly_clients?: number | null
          id?: string
          industry_specializations?: Json | null
          partner_level?: string | null
          services_provided?: Json | null
          success_rate?: number | null
          total_clients_count?: number | null
          updated_at?: string | null
          user_id: string
          years_experience?: number | null
        }
        Update: {
          assigned_manager?: string | null
          business_address?: string | null
          commission_rate?: number | null
          company_name?: string | null
          created_at?: string | null
          expected_monthly_clients?: number | null
          id?: string
          industry_specializations?: Json | null
          partner_level?: string | null
          services_provided?: Json | null
          success_rate?: number | null
          total_clients_count?: number | null
          updated_at?: string | null
          user_id?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "partners_assigned_manager_fkey"
            columns: ["assigned_manager"]
            isOneToOne: false
            referencedRelation: "managers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          is_approved: boolean | null
          name: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_approved?: boolean | null
          name?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_approved?: boolean | null
          name?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      status_changes: {
        Row: {
          changed_by: string
          changed_by_role: string
          comment: string | null
          created_at: string
          customer_id: string
          id: string
          new_status: string
          previous_status: string
        }
        Insert: {
          changed_by: string
          changed_by_role: string
          comment?: string | null
          created_at?: string
          customer_id: string
          id?: string
          new_status: string
          previous_status: string
        }
        Update: {
          changed_by?: string
          changed_by_role?: string
          comment?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          new_status?: string
          previous_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "status_changes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      application_status:
        | "draft"
        | "need_more_info"
        | "return"
        | "submit"
        | "rejected"
        | "completed"
        | "paid"
      lead_source:
        | "website"
        | "referral"
        | "social_media"
        | "partner"
        | "manager"
        | "other"
      license_type: "mainland" | "freezone" | "offshore"
      user_role: "admin" | "manager" | "partner" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: [
        "draft",
        "need_more_info",
        "return",
        "submit",
        "rejected",
        "completed",
        "paid",
      ],
      lead_source: [
        "website",
        "referral",
        "social_media",
        "partner",
        "manager",
        "other",
      ],
      license_type: ["mainland", "freezone", "offshore"],
      user_role: ["admin", "manager", "partner", "user"],
    },
  },
} as const
