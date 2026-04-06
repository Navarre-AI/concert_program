<script>
  import { push } from 'svelte-spa-router';

  let { orgName = '', concertTitle = '', subtitle = '', venue = '', dateTime = '', orgSlug = '', concertId = '' } = $props();

  function goToShare() {
    push(`/${orgSlug}/${concertId}/share`);
  }
</script>

<header class="header">
  <div class="org-name">{orgName}</div>
  <h1 class="concert-title">{concertTitle}</h1>
  {#if subtitle}<p class="subtitle">{subtitle}</p>{/if}
  <div class="meta">
    {#if venue}<span>{venue}</span>{/if}
    {#if dateTime}<span>{new Date(dateTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>{/if}
  </div>
  <button class="share-btn" onclick={goToShare}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
    Share
  </button>
</header>

<style>
  .header {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #fff;
    padding: 2rem 1.5rem 1.5rem;
    text-align: center;
    position: relative;
  }
  .org-name {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    opacity: 0.8;
    margin-bottom: 0.5rem;
  }
  .concert-title {
    font-size: 1.6rem;
    font-weight: 300;
    line-height: 1.2;
    margin-bottom: 0.25rem;
  }
  .subtitle {
    font-size: 1rem;
    opacity: 0.85;
    font-style: italic;
  }
  .meta {
    margin-top: 0.75rem;
    font-size: 0.8rem;
    opacity: 0.7;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .share-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.3);
    color: #fff;
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }
  .share-btn:active {
    background: rgba(255,255,255,0.25);
  }
</style>
