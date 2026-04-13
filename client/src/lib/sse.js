import { subscribe as subscribeDemo } from './demo-bus.js';

export function connectLiveStream(concertId, onEvent) {
  // Try real SSE first
  let source = null;
  let usingDemo = false;
  let demoUnsub = null;

  try {
    source = new EventSource(`/api/concerts/${concertId}/stream`);

    source.addEventListener('piece_change', (e) => {
      onEvent({ type: 'piece_change', ...JSON.parse(e.data) });
    });
    source.addEventListener('status_change', (e) => {
      onEvent({ type: 'status_change', ...JSON.parse(e.data) });
    });
    source.addEventListener('heartbeat', () => {});

    // If the SSE endpoint doesn't exist (static deployment), fall back to demo bus
    source.onerror = () => {
      if (!usingDemo && source.readyState === EventSource.CLOSED) {
        usingDemo = true;
        source.close();
        demoUnsub = subscribeDemo(onEvent);
      }
    };
  } catch {
    usingDemo = true;
    demoUnsub = subscribeDemo(onEvent);
  }

  // Always also listen to demo bus so cross-tab works in demo mode
  if (!usingDemo) {
    demoUnsub = subscribeDemo(onEvent);
  }

  return () => {
    if (source) source.close();
    if (demoUnsub) demoUnsub();
  };
}
