<script>
  import { onMount, onDestroy } from 'svelte';
  import { push } from 'svelte-spa-router';
  import DarkScreen from '../components/DarkScreen.svelte';
  import LyricsDisplay from '../components/LyricsDisplay.svelte';
  import { getConcert, getConcertStatus } from '../lib/api.js';
  import { concert, liveState } from '../lib/stores.js';
  import { connectLiveStream } from '../lib/sse.js';

  let { params = {} } = $props();
  let wakeLock = null;
  let disconnect = null;
  let currentPiece = $derived.by(() => {
    const state = $liveState;
    const c = $concert;
    if (!c || !state.currentPieceId) return null;
    return c.pieces.find(p => p.id === state.currentPieceId) || null;
  });

  async function acquireWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        wakeLock = await navigator.wakeLock.request('screen');
      }
    } catch (e) {
      // Wake lock not available or denied
    }
  }

  onMount(async () => {
    // Load concert data if not already loaded
    if (!$concert) {
      const data = await getConcert(params.concertId);
      concert.set(data);
    }

    // Get current status
    const status = await getConcertStatus(params.concertId);
    liveState.set(status);

    // If not live, go back to program
    if (status.status !== 'live' && status.status !== 'intermission') {
      push(`/${params.orgSlug}/${params.concertId}`);
      return;
    }

    acquireWakeLock();

    // Prevent back navigation while live
    history.pushState(null, '', location.href);
    window.addEventListener('popstate', preventBack);

    // Listen for updates
    disconnect = connectLiveStream(params.concertId, (event) => {
      if (event.type === 'piece_change') {
        liveState.update(s => ({ ...s, currentPieceId: event.pieceId }));
      } else if (event.type === 'status_change') {
        liveState.set(event);
        if (event.status === 'ended') {
          push(`/${params.orgSlug}/${params.concertId}`);
        }
      }
    });
  });

  function preventBack() {
    history.pushState(null, '', location.href);
  }

  onDestroy(() => {
    if (disconnect) disconnect();
    if (wakeLock) wakeLock.release();
    window.removeEventListener('popstate', preventBack);
  });
</script>

{#if $liveState.status === 'intermission'}
  <div class="intermission">
    <p class="label">Intermission</p>
    {#if $concert}
      <p class="org">{$concert.organization.name}</p>
    {/if}
  </div>
{:else if currentPiece}
  <LyricsDisplay
    lyrics={currentPiece.lyricsOriginal}
    workName={currentPiece.workName}
    composer={currentPiece.composer}
  />
{:else if $concert}
  <DarkScreen
    orgName={$concert.organization.name}
    concertTitle={$concert.title}
  />
{:else}
  <DarkScreen orgName="" concertTitle="Loading..." />
{/if}

<style>
  .intermission {
    position: fixed;
    inset: 0;
    background: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    color-scheme: dark;
  }
  .label {
    font-size: 1.8rem;
    font-weight: 300;
    color: rgba(255,255,255,0.6);
    letter-spacing: 0.1em;
  }
  .org {
    margin-top: 1rem;
    font-size: 0.85rem;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
    letter-spacing: 0.2em;
  }
</style>
