<script>
  import { onMount } from 'svelte';
  import { pop } from 'svelte-spa-router';
  import { generateQR } from '../lib/qr.js';

  let { params = {} } = $props();
  let qrDataUrl = $state('');
  let concertUrl = $derived(`${window.location.origin}/#/${params.orgSlug}/${params.concertId}`);

  onMount(async () => {
    qrDataUrl = await generateQR(concertUrl);
  });

  async function shareNative() {
    if (navigator.share) {
      await navigator.share({ title: 'Concert Program', url: concertUrl });
    }
  }
</script>

<div class="share-view">
  <button class="back-btn" onclick={() => pop()}>&#8592; Back</button>

  <div class="share-card">
    <h2>Share This Program</h2>
    <p class="hint">Have others scan this QR code to open the concert program</p>

    {#if qrDataUrl}
      <img src={qrDataUrl} alt="QR Code" class="qr-code" />
    {:else}
      <div class="qr-placeholder">Generating...</div>
    {/if}

    <p class="url">{concertUrl}</p>

    {#if navigator.share}
      <button class="btn-share" onclick={shareNative}>
        Share Link
      </button>
    {/if}
  </div>
</div>

<style>
  .share-view {
    min-height: 100vh;
    background: #fafafa;
    padding: 1rem;
  }
  .back-btn {
    background: none;
    border: none;
    color: #4a47a3;
    font-size: 1rem;
    padding: 0.5rem;
  }
  .share-card {
    max-width: 360px;
    margin: 2rem auto;
    text-align: center;
    background: #fff;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  }
  .share-card h2 {
    font-weight: 400;
    color: #1a1a2e;
    margin-bottom: 0.5rem;
  }
  .hint {
    color: #888;
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
  }
  .qr-code {
    width: 280px;
    height: 280px;
    border-radius: 8px;
  }
  .qr-placeholder {
    width: 280px;
    height: 280px;
    background: #eee;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    color: #aaa;
  }
  .url {
    margin-top: 1rem;
    font-size: 0.75rem;
    color: #aaa;
    word-break: break-all;
  }
  .btn-share {
    margin-top: 1.25rem;
    padding: 0.7rem 2rem;
    background: #4a47a3;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
  }
</style>
