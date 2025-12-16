import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          data: any;
          config: any;
          created_at: string;
          updated_at: string;
          is_public: boolean;
          shared_with: string[];
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      templates: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: string;
          config: any;
          sample_data: any;
          thumbnail: string | null;
          created_by: string;
          is_featured: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['templates']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['templates']['Insert']>;
      };
      data_sources: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'rest_api' | 'google_sheets' | 'airtable' | 'csv_url' | 'sql';
          config: any;
          last_synced: string | null;
          auto_refresh: boolean;
          refresh_interval: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['data_sources']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['data_sources']['Insert']>;
      };
    };
  };
};
