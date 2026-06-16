import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.warn("Supabase URL or Anon Key is missing. Using local mock supabase client.");
  // Mock client to prevent runtime crash and allow local testing via localStorage
  supabaseInstance = {
    from: () => {
      const chain = {
        select: () => {
          return Promise.resolve({ data: JSON.parse(localStorage.getItem('ung_ung_ga_ga_records') || '[]'), error: null });
        },
        order: () => {
          return Promise.resolve({ data: JSON.parse(localStorage.getItem('ung_ung_ga_ga_records') || '[]'), error: null });
        },
        insert: (records) => {
          const mockData = records.map((r) => ({
            id: Math.floor(Math.random() * 1000000),
            created_at: new Date().toISOString(),
            ...r
          }));
          return {
            select: () => Promise.resolve({ data: mockData, error: null })
          };
        },
        update: (record) => {
          return {
            eq: () => ({
              select: () => Promise.resolve({ data: [record], error: null })
            })
          };
        },
        delete: () => {
          return {
            eq: () => Promise.resolve({ error: null })
          };
        }
      };
      return chain;
    }
  };
} else {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseInstance;
