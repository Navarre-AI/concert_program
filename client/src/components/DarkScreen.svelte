<script>
  let { orgName = '', concertTitle = '' } = $props();
</script>

<div class="dark-screen">
  <div class="content">
    <p class="org">{orgName}</p>
    <p class="title">{concertTitle}</p>
  </div>
</div>

<style>
  .dark-screen {
    position: fixed;
    inset: 0;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    color-scheme: dark;
  }
  .content {
    text-align: center;
    padding: 2rem;
  }
  .org {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: rgba(255,255,255,0.4);
    margin-bottom: 0.75rem;
  }
  .title {
    font-size: 1.4rem;
    font-weight: 300;
    color: rgba(255,255,255,0.6);
  }
</style>
