export function connectLiveStream(concertId, onEvent) {
  const source = new EventSource(`/api/concerts/${concertId}/stream`);

  source.addEventListener('piece_change', (e) => {
    onEvent({ type: 'piece_change', ...JSON.parse(e.data) });
  });

  source.addEventListener('status_change', (e) => {
    onEvent({ type: 'status_change', ...JSON.parse(e.data) });
  });

  source.addEventListener('heartbeat', () => {
    // Keep-alive, no action needed
  });

  source.onerror = () => {
    // EventSource auto-reconnects; we just log it
    console.log('SSE connection lost, reconnecting...');
  };

  return () => source.close();
}
