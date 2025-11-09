// lib/auth.js
export function getToken() {
  // For demo purposes (use HTTP-only cookies in production)
  return localStorage.getItem('token'); 
}

// Example: Fetch protected data
export async function fetchUser() {
  const res = await fetch('https://backend.catodrive.com/api/user', {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return await res.json();
}