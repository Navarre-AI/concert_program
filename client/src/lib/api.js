import { demoConcert, demoState } from './demo-data.js';
import { publish, getCurrentState } from './demo-bus.js';

const BASE = '/api';

// Detect demo mode: no backend means /api/health will fail.
// We probe once and cache the result.
let demoMode = null;
async function isDemoMode() {
  if (demoMode !== null) return demoMode;
  try {
    const res = await fetch(`${BASE}/health`, { method: 'GET' });
    demoMode = !res.ok;
  } catch {
    demoMode = true;
  }
  return demoMode;
}

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
export async function getConcert(id) {
  if (await isDemoMode()) return { ...demoConcert };
  return request(`/concerts/${id}`);
}

export async function getConcertStatus(id) {
  if (await isDemoMode()) {
    const stored = getCurrentState();
    return {
      isLive: stored?.status === 'live',
      status: stored?.status || demoState.status,
      currentPieceId: stored?.pieceId ?? demoState.currentPieceId
    };
  }
  return request(`/concerts/${id}/status`);
}

// Controller endpoints
export async function controllerLogin(concertId, pin) {
  if (await isDemoMode()) {
    if (pin !== '1234') throw new Error('Invalid PIN');
    const stored = getCurrentState();
    return {
      token: 'demo-token',
      status: stored?.status || 'published',
      currentPieceId: stored?.pieceId ?? null
    };
  }
  return request(`/control/${concertId}/login`, {
    method: 'POST', body: JSON.stringify({ pin })
  });
}

export async function setPiece(concertId, pieceId, token) {
  if (await isDemoMode()) {
    const stored = getCurrentState() || {};
    publish({ type: 'piece_change', pieceId, status: stored.status || 'live' });
    return { ok: true, currentPieceId: pieceId };
  }
  return request(`/control/${concertId}/set-piece`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ pieceId })
  });
}

export async function setStatus(concertId, status, token) {
  if (await isDemoMode()) {
    const stored = getCurrentState() || {};
    publish({
      type: 'status_change',
      isLive: status === 'live',
      status,
      currentPieceId: status === 'ended' ? null : (stored.pieceId ?? null)
    });
    return { ok: true, status };
  }
  return request(`/control/${concertId}/set-status`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status })
  });
}

// Admin endpoints
export async function adminLogin(email, password) {
  if (await isDemoMode()) {
    if (email !== 'admin@example.com' || password !== 'admin123') {
      throw new Error('Invalid credentials (demo: admin@example.com / admin123)');
    }
    return { token: 'demo-admin', user: { id: 'user-1', email } };
  }
  return request('/admin/login', {
    method: 'POST', body: JSON.stringify({ email, password })
  });
}

export async function getAdminConcerts(token) {
  if (await isDemoMode()) return { concerts: [{ ...demoConcert }] };
  return request('/admin/concerts', { headers: { Authorization: `Bearer ${token}` } });
}

export async function createConcert(data, token) {
  if (await isDemoMode()) throw new Error('Demo mode: create disabled');
  return request('/admin/concerts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
}

export async function updateConcert(id, data, token) {
  if (await isDemoMode()) {
    Object.assign(demoConcert, data);
    return { ...demoConcert };
  }
  return request(`/admin/concerts/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
}

export async function createPiece(concertId, data, token) {
  if (await isDemoMode()) {
    const piece = { id: `piece-${Date.now()}`, concertId, orderNumber: demoConcert.pieces.length + 1, ...data };
    demoConcert.pieces.push(piece);
    return piece;
  }
  return request(`/admin/concerts/${concertId}/pieces`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
}

export async function updatePiece(concertId, pieceId, data, token) {
  if (await isDemoMode()) {
    const piece = demoConcert.pieces.find(p => p.id === pieceId);
    if (piece) Object.assign(piece, data);
    return piece;
  }
  return request(`/admin/concerts/${concertId}/pieces/${pieceId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
}

export async function deletePiece(concertId, pieceId, token) {
  if (await isDemoMode()) {
    demoConcert.pieces = demoConcert.pieces.filter(p => p.id !== pieceId);
    return { ok: true };
  }
  return request(`/admin/concerts/${concertId}/pieces/${pieceId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
}
