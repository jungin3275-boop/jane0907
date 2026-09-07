const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Z3V2bXljZWNhYWhnamd4c3R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NzAyMjUsImV4cCI6MjE0MzM0MjIyNX0.8ADvg27HZOKgnSYJuUrnltxylijE8Rya2SIVlMH2Vv8';
console.log('JWT length:', jwt.length);
console.log('Parts:', jwt.split('.').length);
