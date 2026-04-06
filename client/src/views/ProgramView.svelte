<script>
  import { onMount, onDestroy } from 'svelte';
  import { push } from 'svelte-spa-router';
  import Header from '../components/Header.svelte';
  import PieceCard from '../components/PieceCard.svelte';
  import { getConcert, getConcertStatus } from '../lib/api.js';
  import { concert, liveState } from '../lib/stores.js';
  import { connectLiveStream } from '../lib/sse.js';

  let { params = {} } = $props();
  let loading = $state(true);
  let error = $state(null);
  let disconnect = null;

  onMount(async () => {
    try {
      const data = await getConcert(params.concertId);
      concert.set(data);

      // Check if concert is live and redirect if so
      const status = await getConcertStatus(params.concertId);
      liveState.set(status);
      if (status.status === 'live' || status.status === 'intermission') {
        push(`/${params.orgSlug}/${params.concertId}/live`);
        return;
      }

      // Listen for live events
      disconnect = connectLiveStream(params.concertId, (event) => {
        if (event.type === 'status_change') {
          liveState.set(event);
          if (event.status === 'live' || event.status === 'intermission') {
            push(`/${params.orgSlug}/${params.concertId}/live`);
          }
        }
      });

      loading = false;
    } catch (e) {
      error = e.message;
      loading = false;
    }
  });

  onDestroy(() => {
    if (disconnect) disconnect();
  });
</script>

{#if loading}
  <div class="loading">Loading program...</div>
{:else if error}
  <div class="error">{error}</div>
{:else if $concert}
  <Header
    orgName={$concert.organization.name}
    concertTitle={$concert.title}
    subtitle={$concert.subtitle}
    venue={$concert.venue}
    dateTime={$concert.dateTime}
    orgSlug={params.orgSlug}
    concertId={params.concertId}
  />

  <main class="program-list">
    {#each $concert.pieces as piece, i}
      <PieceCard {piece} index={i} />
    {/each}
  </main>

  <footer class="footer">
    <p>Tap a piece for details and lyrics</p>
  </footer>
{/if}

<style>
  .loading, .error {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-size: 1.1rem;
    color: #888;
  }
  .error {
    color: #c44;
    padding: 2rem;
    text-align: center;
  }
  .program-list {
    padding: 1rem 0;
    min-height: 50vh;
  }
  .footer {
    text-align: center;
    padding: 1.5rem;
    color: #aaa;
    font-size: 0.8rem;
  }
</style>
