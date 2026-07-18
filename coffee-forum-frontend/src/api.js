const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return null;
}

export const api = {
  register: (email, password, displayName) =>
    request("/users/register", {
      method: "POST",
      body: JSON.stringify({ email, password, displayName }),
    }),

  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getCategories: (page = 0, size = 10) =>
    request(`/categories?page=${page}&size=${size}`),

  createCategory: (name, slug, description) =>
    request("/categories", {
      method: "POST",
      body: JSON.stringify({ name, slug, description }),
    }),

  getThreads: (page = 0, size = 10) =>
    request(`/threads?page=${page}&size=${size}`),

  getThreadsByCategory: (categoryId, page = 0, size = 10) =>
    request(`/threads/category/${categoryId}?page=${page}&size=${size}`),

  getThread: (slug) => request(`/threads/${slug}`),

  createThread: (categoryId, title, slug, body) =>
    request("/threads", {
      method: "POST",
      body: JSON.stringify({ categoryId, title, slug, body }),
    }),

  getReplies: (threadId) => request(`/threads/${threadId}/replies`),

  createReply: (threadId, body, idempotencyKey) =>
    request(`/threads/${threadId}/replies`, {
      method: "POST",
      body: JSON.stringify({ body, idempotencyKey }),
    }),

  getMyHistory: () => request("/users/me/history"),
};