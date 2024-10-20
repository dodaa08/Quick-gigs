// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://alunvxkjhxxnldzxcnio.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsdW52eGtqaHh4bmxkenhjbmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0Mzg2ODQsImV4cCI6MjA0NTAxNDY4NH0.7IDyHfwzZkj99aePzOK42ImSHuieIiJDtoHLW1KjlkY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
