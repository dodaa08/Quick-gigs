import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://rjvcgcymdssupzsznwlv.supabase.co";
const supabaseKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdmNnY3ltZHNzdXB6c3pud2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkyNTIxNTgsImV4cCI6MjA0NDgyODE1OH0.k1oRoQ_7FSSmzc9ixwTaeIaSgg1rieFSnBanjbL8Ab0";

export async function supabaseClient(supabaseToken: string) {
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: supabaseToken
        ? { Authorization: `Bearer ${supabaseToken}` }
        : {},
    },
  });
  return supabase;
}

export const supabase = createClient(supabaseUrl, supabaseKey);