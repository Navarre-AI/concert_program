<script>
  import { onMount } from 'svelte';
  import { getConcert, controllerLogin, setPiece, setStatus } from '../lib/api.js';
  import { concert, controllerToken } from '../lib/stores.js';

  let { params = {} } = $props();
  let pin = $state('');
  let authenticated = $state(false);
  let error = $state('');
  let activePieceId = $state(null);
  let concertStatus = $state('published');
  let loading = $state(true);

  onMount(async () => {
    if (!$concert) {
      const data = await getConcert(params.concertId);
      concert.set(data);
    }
    loading = false;
  });

  async function handleLogin(e) {
    e.preventDefault();
    error = '';
    try {
      const result = await controllerLogin(params.concertId, pin);
      controllerToken.set(result.token);
      authenticated = true;
      concertStatus = result.status || 'published';
      activePieceId = result.currentPieceId || null;
    } catch (e) {
      error = 'Invalid PIN';
    }
  }

  async function selectPiece(pieceId) {
    try {
      activePieceId = pieceId;
      await setPiece(params.concertId, pieceId, $controllerToken);
    } catch (e) {
      error = e.message;
    }
  }

  async function clearPiece() {
    try {
      activePieceId = null;
      await setPiece(params.concertId, null, $controllerToken);
    } catch (e) {
      error = e.message;
    }
  }

  async function changeStatus(newStatus) {
    try {
      concertStatus = newStatus;
      await setStatus(params.concertId, newStatus, $controllerToken);
    } catch (e) {
      error = e.message;
    }
  }
</script>

<div class="control-view">
  {#if loading}
    <p class="center">Loading...</p>
  {:else if !authenticated}
    <div class="login-card">
      <h2>Controller Login</h2>
      <p class="hint">Enter the concert PIN to control the live view</p>
      <form onsubmit={handleLogin}>
        <input
          type="tel"
          bind:value={pin}
          placeholder="PIN"
          maxlength="6"
          class="pin-input"
          autofocus
        />
        {#if error}<p class="error">{error}</p>{/if}
        <button type="submit" class="btn-login">Enter</button>
      </form>
    </div>
  {:else}
    <div class="controller">
      <h2>Concert Controller</h2>

      <div class="status-bar">
        <span>Status: <strong>{concertStatus}</strong></span>
        <div class="status-actions">
          {#if concertStatus !== 'live'}
            <button class="btn-go-live" onclick={() => changeStatus('live')}>Go Live</button>
          {/if}
          {#if concertStatus === 'live'}
            <button class="btn-intermission" onclick={() => changeStatus('intermission')}>Intermission</button>
          {/if}
          {#if concertStatus === 'intermission'}
            <button class="btn-go-live" onclick={() => changeStatus('live')}>Resume</button>
          {/if}
          {#if concertStatus !== 'ended' && concertStatus !== 'published'}
            <button class="btn-end" onclick={() => changeStatus('ended')}>End Concert</button>
          {/if}
        </div>
      </div>

      {#if error}<p class="error">{error}</p>{/if}

      <div class="piece-list">
        {#if activePieceId}
          <button class="btn-clear" onclick={clearPiece}>Clear (between pieces)</button>
        {/if}

        {#each $concert.pieces as piece, i}
          <button
            class="piece-btn"
            class:active={activePieceId === piece.id}
            onclick={() => selectPiece(piece.id)}
          >
            <span class="num">{i + 1}</span>
            <div>
              <strong>{piece.workName}</strong>
              <br /><small>{piece.composer}</small>
            </div>
            {#if activePieceId === piece.id}
              <span class="now-playing">NOW</span>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .control-view {
    min-height: 100vh;
    background: #111;
    color: #eee;
    padding: 1rem;
  }
  .center { text-align: center; padding: 3rem; color: #888; }
  .login-card {
    max-width: 320px;
    margin: 4rem auto;
    text-align: center;
  }
  .login-card h2 {
    font-weight: 400;
    margin-bottom: 0.5rem;
  }
  .hint {
    color: #888;
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
  }
  .pin-input {
    width: 100%;
    padding: 1rem;
    font-size: 2rem;
    text-align: center;
    letter-spacing: 0.5em;
    background: #222;
    border: 1px solid #444;
    border-radius: 8px;
    color: #fff;
    margin-bottom: 1rem;
  }
  .pin-input:focus {
    outline: none;
    border-color: #4a47a3;
  }
  .btn-login {
    width: 100%;
    padding: 0.8rem;
    background: #4a47a3;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
  }
  .error {
    color: #f55;
    font-size: 0.85rem;
    margin: 0.5rem 0;
  }
  .controller h2 {
    font-weight: 400;
    margin-bottom: 1rem;
    text-align: center;
  }
  .status-bar {
    background: #1a1a2e;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .status-actions {
    display: flex;
    gap: 0.5rem;
  }
  .btn-go-live {
    padding: 0.5rem 1rem;
    background: #2d8a4e;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
  }
  .btn-intermission {
    padding: 0.5rem 1rem;
    background: #d4a030;
    color: #111;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
  }
  .btn-end {
    padding: 0.5rem 1rem;
    background: #c44;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
  }
  .btn-clear {
    width: 100%;
    padding: 0.75rem;
    background: #333;
    color: #aaa;
    border: 1px dashed #555;
    border-radius: 8px;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  .piece-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .piece-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
    background: #1e1e1e;
    border: 1px solid #333;
    border-radius: 8px;
    color: #ddd;
    text-align: left;
    font-size: 0.9rem;
    transition: background 0.15s;
  }
  .piece-btn:active {
    background: #2a2a2a;
  }
  .piece-btn.active {
    background: #1a3a1a;
    border-color: #2d8a4e;
  }
  .num {
    font-size: 1.3rem;
    font-weight: 200;
    color: #666;
    min-width: 1.5rem;
    text-align: center;
  }
  .piece-btn.active .num {
    color: #4caf50;
  }
  .now-playing {
    margin-left: auto;
    background: #2d8a4e;
    color: #fff;
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
  }
  small { color: #888; }
</style>
