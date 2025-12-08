export type Image = {
  id: string;                         // UUID from the Supabase table
  user_id: string;                    // Owner's user ID
  path: string;                       // Storage path
  filename: string;                   // Original filename
  category_id: string | null;         // Category ID
  category_name?: string | null;      // Category, e.g., "all", "animals", etc.
  created_at: string;                 // Timestamp
  updated_at: string;                 // Timestamp
  url: string;                        // Public URL for displaying
};
