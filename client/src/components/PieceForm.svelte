<script>
  let { piece = null, onsave, oncancel } = $props();

  let workName = $state(piece?.workName || '');
  let composer = $state(piece?.composer || '');
  let arranger = $state(piece?.arranger || '');
  let description = $state(piece?.description || '');
  let lyricsOriginal = $state(piece?.lyricsOriginal || '');
  let lyricsLanguageCode = $state(piece?.lyricsLanguageCode || '');
  let soloists = $state(piece?.soloists || '');
  let sponsor = $state(piece?.sponsor || '');

  function handleSubmit(e) {
    e.preventDefault();
    onsave({
      workName, composer, arranger, description,
      lyricsOriginal, lyricsLanguageCode, soloists, sponsor
    });
  }
</script>

<form class="piece-form" onsubmit={handleSubmit}>
  <label>
    <span>Work Name *</span>
    <input type="text" bind:value={workName} required />
  </label>

  <label>
    <span>Composer *</span>
    <input type="text" bind:value={composer} required />
  </label>

  <label>
    <span>Arranger</span>
    <input type="text" bind:value={arranger} />
  </label>

  <label>
    <span>Soloists</span>
    <input type="text" bind:value={soloists} placeholder="e.g., John Smith, soprano" />
  </label>

  <label>
    <span>Description / Program Notes</span>
    <textarea bind:value={description} rows="3"></textarea>
  </label>

  <label>
    <span>Lyrics (Original Language)</span>
    <textarea bind:value={lyricsOriginal} rows="6" placeholder="Paste lyrics here..."></textarea>
  </label>

  <label>
    <span>Original Language Code</span>
    <input type="text" bind:value={lyricsLanguageCode} placeholder="e.g., la, fr, el, en" />
  </label>

  <label>
    <span>Sponsor</span>
    <input type="text" bind:value={sponsor} />
  </label>

  <div class="actions">
    <button type="button" class="btn-cancel" onclick={oncancel}>Cancel</button>
    <button type="submit" class="btn-save">Save</button>
  </div>
</form>

<style>
  .piece-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  label span {
    font-size: 0.8rem;
    font-weight: 600;
    color: #555;
  }
  input, textarea {
    padding: 0.6rem 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.95rem;
    font-family: inherit;
    background: #fff;
  }
  input:focus, textarea:focus {
    outline: none;
    border-color: #4a47a3;
    box-shadow: 0 0 0 2px rgba(74, 71, 163, 0.15);
  }
  .actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }
  .btn-cancel {
    padding: 0.6rem 1.25rem;
    background: #eee;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #666;
  }
  .btn-save {
    padding: 0.6rem 1.25rem;
    background: #4a47a3;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #fff;
  }
  .btn-save:active {
    background: #3d3a8a;
  }
</style>
