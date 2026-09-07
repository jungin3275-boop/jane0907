import { createClient } from '@supabase/supabase-js';

const url = 'https://kuguvmycecaahgjgxstz.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Z3V2bXljZWNhYWhnamd4c3R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NzAyMjUsImV4cCI6MjE0MzM0MjIyNX0.8ADvg27HZOKgnSYJuUrnltxylijE8Rya2SIVlMH2Vv8';

const supabase = createClient(url, key);

async function checkPosts() {
  const { data, error } = await supabase.from('posts').select('*');
  console.log('--- SUPABASE POSTS CHECK ---');
  console.log('Error:', error);
  console.log('Data length:', data ? data.length : 0);
  console.log('Posts:', JSON.stringify(data, null, 2));
}

checkPosts();
