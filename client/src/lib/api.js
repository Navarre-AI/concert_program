const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

// Public endpoints
export const getConcert = (id) => request(`/concerts/${id}`);
export const getConcertStatus = (id) => request(`/concerts/${id}/status`);

// Controller endpoints
export const controllerLogin = (concertId, pin) =>
  request(`/control/${concertId}/login`, {
    method: 'POST',
    body: JSON.stringify({ pin })
  });

export const setPiece = (concertId, pieceId, token) =>
  request(`/control/${concertId}/set-piece`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ pieceId })
  });

export const setStatus = (concertId, status, token) =>
  request(`/control/${concertId}/set-status`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status })
  });

// Admin endpoints
export const adminLogin = (email, password) =>
  request('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

export const getAdminConcerts = (token) =>
  request('/admin/concerts', {
    headers: { Authorization: `Bearer ${token}` }
  });

export const createConcert = (data, token) =>
  request('/admin/concerts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });

export const updateConcert = (id, data, token) =>
  request(`/admin/concerts/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });

export const createPiece = (concertId, data, token) =>
  request(`/admin/concerts/${concertId}/pieces`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });

export const updatePiece = (concertId, pieceId, data, token) =>
  request(`/admin/concerts/${concertId}/pieces/${pieceId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });

export const deletePiece = (concertId, pieceId, token) =>
  request(`/admin/concerts/${concertId}/pieces/${pieceId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
