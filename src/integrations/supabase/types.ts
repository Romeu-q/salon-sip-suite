export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          client_id: string | null
          client_name: string
          combo_id: string | null
          created_at: string
          duration: number
          end_time: string | null
          id: string
          notes: string | null
          price: number
          professional_id: string
          service_id: string | null
          service_name: string
          start_time: string
          status: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          appointment_date?: string
          client_id?: string | null
          client_name: string
          combo_id?: string | null
          created_at?: string
          duration: number
          end_time?: string | null
          id?: string
          notes?: string | null
          price?: number
          professional_id: string
          service_id?: string | null
          service_name: string
          start_time: string
          status?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          client_id?: string | null
          client_name?: string
          combo_id?: string | null
          created_at?: string
          duration?: number
          end_time?: string | null
          id?: string
          notes?: string | null
          price?: number
          professional_id?: string
          service_id?: string | null
          service_name?: string
          start_time?: string
          status?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_combo_id_fkey"
            columns: ["combo_id"]
            isOneToOne: false
            referencedRelation: "service_combos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          tenant_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          tenant_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_entries: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          order_id: string | null
          tenant_id: string
          type: Database["public"]["Enums"]["financial_type"]
        }
        Insert: {
          amount?: number
          category?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          order_id?: string | null
          tenant_id: string
          type: Database["public"]["Enums"]["financial_type"]
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          order_id?: string | null
          tenant_id?: string
          type?: Database["public"]["Enums"]["financial_type"]
        }
        Relationships: [
          {
            foreignKeyName: "financial_entries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_entries_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      fiscal_settings: {
        Row: {
          api_key_encrypted: string | null
          certificate_path: string | null
          created_at: string
          environment: string | null
          id: string
          nfce_provider: string | null
          settings: Json | null
          tenant_id: string
        }
        Insert: {
          api_key_encrypted?: string | null
          certificate_path?: string | null
          created_at?: string
          environment?: string | null
          id?: string
          nfce_provider?: string | null
          settings?: Json | null
          tenant_id: string
        }
        Update: {
          api_key_encrypted?: string | null
          certificate_path?: string | null
          created_at?: string
          environment?: string | null
          id?: string
          nfce_provider?: string | null
          settings?: Json | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fiscal_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_product_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          quantity: number
          unit_price: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          quantity?: number
          unit_price?: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_product_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_product_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_service_items: {
        Row: {
          appointment_id: string | null
          id: string
          order_id: string
          price: number
          professional_id: string | null
          service_id: string | null
        }
        Insert: {
          appointment_id?: string | null
          id?: string
          order_id: string
          price?: number
          professional_id?: string | null
          service_id?: string | null
        }
        Update: {
          appointment_id?: string | null
          id?: string
          order_id?: string
          price?: number
          professional_id?: string | null
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_service_items_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_service_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_service_items_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_service_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          client_id: string | null
          closed_at: string | null
          created_at: string
          discount: number | null
          id: string
          payment_method: string | null
          professional_commission: number | null
          status: Database["public"]["Enums"]["order_status"]
          tenant_id: string
          total: number | null
        }
        Insert: {
          client_id?: string | null
          closed_at?: string | null
          created_at?: string
          discount?: number | null
          id?: string
          payment_method?: string | null
          professional_commission?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          tenant_id: string
          total?: number | null
        }
        Update: {
          client_id?: string | null
          closed_at?: string | null
          created_at?: string
          discount?: number | null
          id?: string
          payment_method?: string | null
          professional_commission?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          tenant_id?: string
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number | null
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order?: number | null
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          category: string
          category_id: string | null
          cost_price: number | null
          created_at: string
          emoji: string
          id: string
          image_url: string | null
          min_stock: number | null
          name: string
          sell_price: number | null
          stock_qty: number
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          category?: string
          category_id?: string | null
          cost_price?: number | null
          created_at?: string
          emoji?: string
          id?: string
          image_url?: string | null
          min_stock?: number | null
          name: string
          sell_price?: number | null
          stock_qty?: number
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          category_id?: string | null
          cost_price?: number | null
          created_at?: string
          emoji?: string
          id?: string
          image_url?: string | null
          min_stock?: number | null
          name?: string
          sell_price?: number | null
          stock_qty?: number
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          active: boolean
          avatar: string
          color: string
          commission: number
          created_at: string
          id: string
          name: string
          specialty: string
          tenant_id: string | null
          updated_at: string
          work_schedule: Json | null
        }
        Insert: {
          active?: boolean
          avatar?: string
          color?: string
          commission?: number
          created_at?: string
          id?: string
          name: string
          specialty: string
          tenant_id?: string | null
          updated_at?: string
          work_schedule?: Json | null
        }
        Update: {
          active?: boolean
          avatar?: string
          color?: string
          commission?: number
          created_at?: string
          id?: string
          name?: string
          specialty?: string
          tenant_id?: string | null
          updated_at?: string
          work_schedule?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "professionals_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number | null
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order?: number | null
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_categories_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      service_combo_items: {
        Row: {
          combo_id: string
          id: string
          service_id: string
          sort_order: number | null
        }
        Insert: {
          combo_id: string
          id?: string
          service_id: string
          sort_order?: number | null
        }
        Update: {
          combo_id?: string
          id?: string
          service_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_combo_items_combo_id_fkey"
            columns: ["combo_id"]
            isOneToOne: false
            referencedRelation: "service_combos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_combo_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_combos: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          price: number
          tenant_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          price?: number
          tenant_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          price?: number
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_combos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean
          category: string
          category_id: string | null
          created_at: string
          duration_minutes: number
          id: string
          name: string
          price: number
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          category?: string
          category_id?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          name: string
          price?: number
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          category_id?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          name?: string
          price?: number
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string
          id: string
          name: string
          settings: Json | null
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          settings?: Json | null
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          settings?: Json | null
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_tenant_id: { Args: never; Returns: string }
    }
    Enums: {
      app_role: "owner" | "admin" | "staff"
      appointment_status:
        | "scheduled"
        | "in_salon"
        | "delayed"
        | "finished"
        | "cancelled"
      financial_type: "income" | "expense"
      order_status: "open" | "closed" | "cancelled"
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
      app_role: ["owner", "admin", "staff"],
      appointment_status: [
        "scheduled",
        "in_salon",
        "delayed",
        "finished",
        "cancelled",
      ],
      financial_type: ["income", "expense"],
      order_status: ["open", "closed", "cancelled"],
    },
  },
} as const
