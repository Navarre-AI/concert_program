<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { getAdminConcerts, createConcert } from '../lib/api.js';
  import { adminToken } from '../lib/stores.js';

  let concerts = $state([]);
  let loading = $state(true);
  let showForm = $state(false);
  let newTitle = $state('');
  let newVenue = $state('');
  let newDateTime = $state('');
  let newPin = $state('');
  let error = $state('');

  onMount(async () => {
    if (!$adminToken) { push('/admin'); return; }
    await loadConcerts();
  });

  async function loadConcerts() {
    try {
      const data = await getAdminConcerts($adminToken);
      concerts = data.concerts || [];
      loading = false;
    } catch (e) {
      if (e.message.includes('401') || e.message.includes('Unauthorized')) {
        adminToken.set(null);
        push('/admin');
      }
      error = e.message;
      loading = false;
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      await createConcert({
        title: newTitle,
        venue: newVenue,
        dateTime: newDateTime,
        controllerPin: newPin
      }, $adminToken);
      showForm = false;
      newTitle = ''; newVenue = ''; newDateTime = ''; newPin = '';
      await loadConcerts();
    } catch (e) {
      error = e.message;
    }
  }

  function logout() {
    adminToken.set(null);
    push('/admin');
  }
</script>

<div class="admin-page">
  <header class="admin-header">
    <h1>Concerts</h1>
    <button class="btn-logout" onclick={logout}>Log Out</button>
  </header>

  {#if loading}
    <p class="center">Loading...</p>
  {:else}
    {#if error}<p class="error">{error}</p>{/if}

    <div class="concert-list">
      {#each concerts as c}
        <button class="concert-item" onclick={() => push(`/admin/concerts/${c.id}`)}>
          <div>
            <strong>{c.title}</strong>
            <br /><small>{c.venue} &middot; {c.status}</small>
          </div>
          <span class="arrow">&#8250;</span>
        </button>
      {/each}

      {#if concerts.length === 0}
        <p class="empty">No concerts yet. Create your first one!</p>
      {/if}
    </div>

    {#if showForm}
      <div class="new-form">
        <h3>New Concert</h3>
        <form onsubmit={handleCreate}>
          <input type="text" bind:value={newTitle} placeholder="Concert Title" required />
          <input type="text" bind:value={newVenue} placeholder="Venue" />
          <input type="datetime-local" bind:value={newDateTime} />
          <input type="tel" bind:value={newPin} placeholder="Controller PIN (4-6 digits)" maxlength="6" />
          <div class="form-actions">
            <button type="button" onclick={() => showForm = false}>Cancel</button>
            <button type="submit" class="btn-create">Create</button>
          </div>
        </form>
      </div>
    {:else}
      <button class="btn-add" onclick={() => showForm = true}>+ New Concert</button>
    {/if}
  {/if}
</div>

<style>
  .admin-page {
    min-height: 100vh;
    background: #f5f5f5;
    padding: 1rem;
  }
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  .admin-header h1 {
    font-size: 1.5rem;
    font-weight: 400;
    color: #1a1a2e;
  }
  .btn-logout {
    background: none;
    border: 1px solid #ddd;
    padding: 0.4rem 1rem;
    border-radius: 6px;
    color: #888;
    font-size: 0.85rem;
  }
  .center { text-align: center; padding: 3rem; color: #888; }
  .error { color: #c44; font-size: 0.85rem; margin-bottom: 1rem; }
  .concert-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  .concert-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    background: #fff;
    border: none;
    border-radius: 10px;
    text-align: left;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    font-size: 0.95rem;
    color: #1a1a2e;
  }
  .concert-item:active { background: #f9f9f9; }
  .arrow { color: #ccc; font-size: 1.5rem; }
  small { color: #888; }
  .empty { text-align: center; color: #aaa; padding: 2rem; }
  .new-form {
    background: #fff;
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }
  .new-form h3 {
    font-weight: 500;
    margin-bottom: 1rem;
  }
  .new-form form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .new-form input {
    padding: 0.6rem 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.95rem;
  }
  .new-form input:focus {
    outline: none;
    border-color: #4a47a3;
  }
  .form-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }
  .form-actions button {
    padding: 0.5rem 1.25rem;
    border-radius: 6px;
    border: none;
    font-size: 0.9rem;
  }
  .form-actions button:first-child {
    background: #eee;
    color: #666;
  }
  .btn-create {
    background: #4a47a3;
    color: #fff;
  }
  .btn-add {
    width: 100%;
    padding: 0.85rem;
    background: #4a47a3;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
  }
</style>
