import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL  = 'https://aknvitrtfxqjdwiyxryt.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrbnZpdHJ0ZnhxamR3aXl4cnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NzkyODcsImV4cCI6MjA5MjU1NTI4N30.uzH77zwLo27oiMswxSQJsnhMbt1TX3TVedcqUYgjslE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    storage:            AsyncStorage,
    autoRefreshToken:   true,
    persistSession:     true,
    detectSessionInUrl: false,
  },
});
