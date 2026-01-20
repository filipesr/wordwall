export interface Database {
  public: {
    Tables: {
      scores: {
        Row: {
          id: string;
          player_name: string;
          score: number;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_name: string;
          score: number;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          player_name?: string;
          score?: number;
          category?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Score = Database['public']['Tables']['scores']['Row'];
export type ScoreInsert = Database['public']['Tables']['scores']['Insert'];
