const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Z3V2bXljZWNhYWhnamd4c3R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NzAyMjUsImV4cCI6MjEwMzM0NjIyNX0.8ADvg27HZOKgnSYJuUrnltxylijE8Rya2SIVlMH2Vv8';
const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString());
console.log(payload);
