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

  getCategory: (id) => request(`/categories/${id}`),

  createCategory: (name, slug, description) =>
    request("/categories", {
      method: "POST",
      body: JSON.stringify({ name, slug, description }),
    }),

  deleteCategory: (id) => request(`/categories/${id}`, { method: "DELETE" }),

  getThreads: (page = 0, size = 10) =>
    request(`/threads?page=${page}&size=${size}`),

  getThreadsByCategory: (categoryId, page = 0, size = 10) =>
    request(`/threads/category/${categoryId}?page=${page}&size=${size}`),

  getThreadsByTag: (tagName, page = 0, size = 10) =>
    request(`/threads/tag/${encodeURIComponent(tagName)}?page=${page}&size=${size}`),

  searchThreads: (q, page = 0, size = 10) =>
    request(`/threads/search?q=${encodeURIComponent(q)}&page=${page}&size=${size}`),

  getThread: (slug) => request(`/threads/${slug}`),

  createThread: (categoryId, title, slug, body, tagNames = []) =>
    request("/threads", {
      method: "POST",
      body: JSON.stringify({ categoryId, title, slug, body, tagNames }),
    }),

  updateThread: (id, title, body, tagNames = []) =>
    request(`/threads/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, body, tagNames }),
    }),

  deleteThread: (id) => request(`/threads/${id}`, { method: "DELETE" }),

  getReplies: (threadId) => request(`/threads/${threadId}/replies`),

  createReply: (threadId, body, idempotencyKey) =>
    request(`/threads/${threadId}/replies`, {
      method: "POST",
      body: JSON.stringify({ body, idempotencyKey }),
    }),

  updateReply: (threadId, replyId, body) =>
    request(`/threads/${threadId}/replies/${replyId}`, {
      method: "PUT",
      body: JSON.stringify({ body }),
    }),

  deleteReply: (threadId, replyId) =>
    request(`/threads/${threadId}/replies/${replyId}`, { method: "DELETE" }),

  getMySuggestions: () => request("/suggestions/me"),

  createSuggestion: (title, body) =>
    request("/suggestions", {
      method: "POST",
      body: JSON.stringify({ title, body }),
    }),

  getTags: () => request("/tags"),

  createTag: (name) =>
    request("/tags", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),

  deleteTag: (id) => request(`/tags/${id}`, { method: "DELETE" }),

  getMyHistory: () => request("/users/me/history"),

  getNews: (page = 0, size = 10) =>
    request(`/news?page=${page}&size=${size}`),

  deleteNewsItem: (id) => request(`/news/${id}`, { method: "DELETE" }),
};
