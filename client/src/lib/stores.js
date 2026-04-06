import { writable } from 'svelte/store';

// Concert program data (loaded once)
export const concert = writable(null);

// Live session state (updated via SSE)
export const liveState = writable({
  isLive: false,
  status: 'published', // draft | published | live | intermission | ended
  currentPieceId: null
});

// Admin auth
export const adminToken = writable(localStorage.getItem('adminToken') || null);
adminToken.subscribe((val) => {
  if (val) localStorage.setItem('adminToken', val);
  else localStorage.removeItem('adminToken');
});

// Controller auth
export const controllerToken = writable(null);
