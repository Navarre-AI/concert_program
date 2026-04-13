// BroadcastChannel-based "fake SSE" so controller and audience tabs can sync
// in demo mode (no backend). Falls back to localStorage events if BroadcastChannel
// isn't supported.

const CHANNEL = 'concert-program-demo';
const STORAGE_KEY = 'concert-program-demo-state';

let channel = null;
if (typeof BroadcastChannel !== 'undefined') {
  channel = new BroadcastChannel(CHANNEL);
}

export function publish(event) {
  if (channel) {
    channel.postMessage(event);
  }
  // Also persist to localStorage so new tabs pick up current state on load
  if (event.type === 'piece_change' || event.type === 'status_change') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(event));
  }
}

export function subscribe(handler) {
  // Read initial state from localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) handler(JSON.parse(stored));
  } catch {}

  if (channel) {
    const listener = (e) => handler(e.data);
    channel.addEventListener('message', listener);
    return () => channel.removeEventListener('message', listener);
  }

  // Fallback: storage events fire across tabs
  const storageListener = (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try { handler(JSON.parse(e.newValue)); } catch {}
    }
  };
  window.addEventListener('storage', storageListener);
  return () => window.removeEventListener('storage', storageListener);
}

export function getCurrentState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}
