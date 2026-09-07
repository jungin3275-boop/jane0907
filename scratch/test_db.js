import { createClient } from '@supabase/supabase-js';

const url = 'https://kuguvmycecaahjgxstz.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Z3V2bXljZWNhYWhnamd4c3R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NzAyMjUsImV4cCI6MjEwMzM0MjIyNX0.8ADvg27HZOKgnSYJuUrnltxylijE8Rya2SIVlMH2Vv8';

const supabase = createClient(url, key);

async function test() {
  console.log('Testing Supabase query...');
  const { data, error } = await supabase.from('posts').select('*');
  console.log('Data:', data);
  console.log('Error:', error);
}

test();
