// API base URL — uses env variable, or falls back to backend port 5000
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, options);
  return res;
}

export default API_BASE;
