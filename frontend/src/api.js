// Detect if running locally or deployed on production (e.g. Vercel)
const isLocal = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// API base URL — uses VITE_API_URL, or local backend, or deployed Render backend
const API_BASE = import.meta.env.VITE_API_URL || 
  (isLocal ? 'http://localhost:5000' : 'https://belhekar-new-erp.onrender.com');

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, options);
  return res;
}

export default API_BASE;
