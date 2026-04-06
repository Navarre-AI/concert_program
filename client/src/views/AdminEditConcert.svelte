<script>
  import { onMount } from 'svelte';
  import { push, pop } from 'svelte-spa-router';
  import PieceForm from '../components/PieceForm.svelte';
  import { adminToken } from '../lib/stores.js';
  import { updateConcert, createPiece, updatePiece, deletePiece } from '../lib/api.js';

  let { params = {} } = $props();
  let concert = $state(null);
  let loading = $state(true);
  let editingPiece = $state(null); // null = not editing, 'new' = new piece, or piece object
  let error = $state('');

  // Concert fields
  let title = $state('');
  let subtitle = $state('');
  let venue = $state('');
  let dateTime = $state('');
  let controllerPin = $state('');
  let status = $state('draft');

  onMount(async () => {
    if (!$adminToken) { push('/admin'); return; }
    try {
      const res = await fetch(`/api/admin/concerts/${params.id}`, {
        headers: { Authorization: `Bearer ${$adminToken}` }
      });
      const data = await res.json();
      concert = data;
      title = data.title || '';
      subtitle = data.subtitle || '';
      venue = data.venue || '';
      dateTime = data.dateTime || '';
      controllerPin = data.controllerPin || '';
      status = data.status || 'draft';
      loading = false;
    } catch (e) {
      error = e.message;
      loading = false;
    }
  });

  async function saveConcertDetails() {
    try {
      await updateConcert(params.id, { title, subtitle, venue, dateTime, controllerPin, status }, $adminToken);
      concert = { ...concert, title, subtitle, venue, dateTime, controllerPin, status };
    } catch (e) {
      error = e.message;
    }
  }

  async function handleSavePiece(pieceData) {
    try {
      if (editingPiece === 'new') {
        const result = await createPiece(params.id, pieceData, $adminToken);
        concert.pieces = [...concert.pieces, result];
      } else {
        const result = await updatePiece(params.id, editingPiece.id, pieceData, $adminToken);
        concert.pieces = concert.pieces.map(p => p.id === editingPiece.id ? result : p);
      }
      editingPiece = null;
    } catch (e) {
      error = e.message;
    }
  }

  async function handleDeletePiece(pieceId) {
    if (!confirm('Delete this piece from the program?')) return;
    try {
      await deletePiece(params.id, pieceId, $adminToken);
      concert.pieces = concert.pieces.filter(p => p.id !== pieceId);
    } catch (e) {
      error = e.message;
    }
  }
</script>

<div class="admin-page">
  <button class="back-btn" onclick={() => push('/admin/concerts')}>&#8592; All Concerts</button>

  {#if loading}
    <p class="center">Loading...</p>
  {:else if concert}
    <section class="section">
      <h2>Concert Details</h2>
      <div class="form-grid">
        <label>
          <span>Title</span>
          <input type="text" bind:value={title} />
        </label>
        <label>
          <span>Subtitle</span>
          <input type="text" bind:value={subtitle} />
        </label>
        <label>
          <span>Venue</span>
          <input type="text" bind:value={venue} />
        </label>
        <label>
          <span>Date & Time</span>
          <input type="datetime-local" bind:value={dateTime} />
        </label>
        <label>
          <span>Controller PIN</span>
          <input type="tel" bind:value={controllerPin} maxlength="6" />
        </label>
        <label>
          <span>Status</span>
          <select bind:value={status}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>
      <button class="btn-save" onclick={saveConcertDetails}>Save Details</button>
    </section>

    {#if error}<p class="error">{error}</p>{/if}

    <section class="section">
      <div class="section-header">
        <h2>Program ({concert.pieces?.length || 0} pieces)</h2>
        <button class="btn-add-piece" onclick={() => editingPiece = 'new'}>+ Add Piece</button>
      </div>

      {#if editingPiece}
        <div class="form-card">
          <h3>{editingPiece === 'new' ? 'New Piece' : 'Edit Piece'}</h3>
          <PieceForm
            piece={editingPiece === 'new' ? null : editingPiece}
            onsave={handleSavePiece}
            oncancel={() => editingPiece = null}
          />
        </div>
      {/if}

      <div class="pieces-list">
        {#each (concert.pieces || []) as piece, i}
          <div class="piece-item">
            <span class="num">{i + 1}</span>
            <div class="piece-info">
              <strong>{piece.workName}</strong>
              <small>{piece.composer}{piece.arranger ? ` (arr. ${piece.arranger})` : ''}</small>
            </div>
            <div class="piece-actions">
              <button onclick={() => editingPiece = piece}>Edit</button>
              <button class="btn-delete" onclick={() => handleDeletePiece(piece.id)}>Delete</button>
            </div>
          </div>
        {/each}
        {#if !concert.pieces?.length}
          <p class="empty">No pieces yet. Add your first piece to the program.</p>
        {/if}
      </div>
    </section>
  {/if}
</div>

<style>
  .admin-page {
    min-height: 100vh;
    background: #f5f5f5;
    padding: 1rem;
    max-width: 600px;
    margin: 0 auto;
  }
  .back-btn {
    background: none;
    border: none;
    color: #4a47a3;
    font-size: 1rem;
    padding: 0.5rem 0;
    margin-bottom: 1rem;
  }
  .center { text-align: center; padding: 3rem; color: #888; }
  .error { color: #c44; font-size: 0.85rem; margin: 0.75rem 0; }
  .section {
    background: #fff;
    border-radius: 10px;
    padding: 1.25rem;
    margin-bottom: 1rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }
  .section h2 {
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 1rem;
    color: #1a1a2e;
  }
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .form-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .form-grid label {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .form-grid span {
    font-size: 0.8rem;
    font-weight: 600;
    color: #555;
  }
  .form-grid input, .form-grid select {
    padding: 0.6rem 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.95rem;
  }
  .form-grid input:focus, .form-grid select:focus {
    outline: none;
    border-color: #4a47a3;
  }
  .btn-save {
    margin-top: 1rem;
    padding: 0.6rem 1.5rem;
    background: #4a47a3;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
  }
  .btn-add-piece {
    background: #4a47a3;
    color: #fff;
    border: none;
    padding: 0.4rem 0.85rem;
    border-radius: 6px;
    font-size: 0.8rem;
  }
  .form-card {
    background: #fafafa;
    border-radius: 8px;
    padding: 1.25rem;
    margin: 1rem 0;
    border: 1px solid #eee;
  }
  .form-card h3 {
    font-size: 1rem;
    margin-bottom: 0.75rem;
    color: #1a1a2e;
  }
  .pieces-list {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .piece-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #fafafa;
    border-radius: 8px;
  }
  .num {
    font-size: 1.1rem;
    color: #aaa;
    font-weight: 200;
    min-width: 1.25rem;
    text-align: center;
  }
  .piece-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
  }
  .piece-info small { color: #888; }
  .piece-actions {
    display: flex;
    gap: 0.35rem;
  }
  .piece-actions button {
    padding: 0.3rem 0.6rem;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 4px;
    font-size: 0.75rem;
    color: #666;
  }
  .btn-delete { color: #c44 !important; border-color: #fdd !important; }
  .empty { text-align: center; color: #aaa; padding: 1.5rem; font-size: 0.9rem; }
</style>
