<script>
  let { piece = {}, index = 0 } = $props();
  let expanded = $state(false);
</script>

<div class="piece-card" onclick={() => expanded = !expanded}>
  <div class="piece-header">
    <span class="order">{index + 1}</span>
    <div class="piece-info">
      <h3 class="work-name">{piece.workName}</h3>
      <p class="composer">
        {piece.composer}
        {#if piece.arranger}<span class="arranger">arr. {piece.arranger}</span>{/if}
      </p>
      {#if piece.soloists}
        <p class="soloists">{piece.soloists}</p>
      {/if}
    </div>
    <span class="chevron" class:open={expanded}>&#9660;</span>
  </div>

  {#if expanded}
    <div class="piece-details">
      {#if piece.description}
        <p class="description">{piece.description}</p>
      {/if}
      {#if piece.lyricsOriginal}
        <div class="lyrics-preview">
          <h4>Lyrics <span class="lang">({piece.lyricsLanguageCode || 'original'})</span></h4>
          <pre class="lyrics-text">{piece.lyricsOriginal}</pre>
        </div>
      {/if}
      {#if piece.sponsor}
        <p class="sponsor">Sponsored by {piece.sponsor}</p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .piece-card {
    background: #fff;
    border-radius: 10px;
    padding: 1rem 1.25rem;
    margin: 0 1rem 0.75rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    cursor: pointer;
    transition: box-shadow 0.2s;
  }
  .piece-card:active {
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }
  .piece-header {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }
  .order {
    font-size: 1.5rem;
    font-weight: 200;
    color: #4a47a3;
    min-width: 1.5rem;
    text-align: center;
    line-height: 1.2;
  }
  .piece-info {
    flex: 1;
  }
  .work-name {
    font-size: 1.05rem;
    font-weight: 600;
    color: #1a1a2e;
    line-height: 1.3;
  }
  .composer {
    font-size: 0.85rem;
    color: #666;
    margin-top: 0.15rem;
  }
  .arranger {
    font-style: italic;
    margin-left: 0.25rem;
  }
  .soloists {
    font-size: 0.8rem;
    color: #4a47a3;
    margin-top: 0.25rem;
  }
  .chevron {
    font-size: 0.7rem;
    color: #aaa;
    transition: transform 0.2s;
    margin-top: 0.3rem;
  }
  .chevron.open {
    transform: rotate(180deg);
  }
  .piece-details {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid #eee;
  }
  .description {
    font-size: 0.9rem;
    color: #444;
    line-height: 1.6;
  }
  .lyrics-preview {
    margin-top: 0.75rem;
  }
  .lyrics-preview h4 {
    font-size: 0.8rem;
    color: #888;
    font-weight: 500;
    margin-bottom: 0.35rem;
  }
  .lang {
    font-weight: 400;
    font-style: italic;
  }
  .lyrics-text {
    font-family: inherit;
    font-size: 0.85rem;
    color: #555;
    white-space: pre-wrap;
    line-height: 1.6;
    max-height: 200px;
    overflow-y: auto;
  }
  .sponsor {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: #999;
    font-style: italic;
  }
</style>
