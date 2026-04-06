<script>
  let { lyrics = '', workName = '', composer = '' } = $props();
</script>

<div class="lyrics-overlay">
  <div class="piece-info">
    <p class="work-name">{workName}</p>
    <p class="composer">{composer}</p>
  </div>
  {#if lyrics}
    <div class="lyrics-scroll">
      <pre class="lyrics">{lyrics}</pre>
    </div>
  {:else}
    <p class="no-lyrics">No lyrics for this piece</p>
  {/if}
</div>

<style>
  .lyrics-overlay {
    position: fixed;
    inset: 0;
    background: #000;
    color: #e0e0e0;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    color-scheme: dark;
    overflow: hidden;
  }
  .piece-info {
    padding: 1.5rem 1.5rem 0.75rem;
    text-align: center;
    flex-shrink: 0;
  }
  .work-name {
    font-size: 1.1rem;
    font-weight: 500;
    color: rgba(255,255,255,0.7);
  }
  .composer {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.4);
    margin-top: 0.25rem;
  }
  .lyrics-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 1.5rem 3rem;
    -webkit-overflow-scrolling: touch;
  }
  .lyrics {
    font-family: inherit;
    font-size: clamp(1.2rem, 4vw, 1.8rem);
    line-height: 1.8;
    white-space: pre-wrap;
    color: #e0e0e0;
  }
  .no-lyrics {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    color: rgba(255,255,255,0.4);
    font-style: italic;
  }
</style>
