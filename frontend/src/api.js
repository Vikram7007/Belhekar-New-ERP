// API base URL — uses env variable in production, proxy in development
const API_BASE = import.meta.env.VITE_API_URL || '';

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, options);
  return res;
}

export default API_BASE;
