import axios from 'axios';

// Vite proxies /api → http://localhost:8080 in dev (see vite.config.js)
// In Docker, nginx proxies /api → backend container
const API = axios.create({
  baseURL: 'https://notes-backend-tw6m.onrender.com/api/notes',
  headers: { 'Content-Type': 'application/json' },
});

export const notesApi = {
  getAll: () => API.get('/'),
  getById: (id) => API.get(`/${id}`),
  create: (note) => API.post('/', note),
  update: (id, note) => API.put(`/${id}`, note),
  delete: (id) => API.delete(`/${id}`),
  search: (q) => API.get(`/search?q=${encodeURIComponent(q)}`),
};
