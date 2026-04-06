<script>
  import Router, { push } from 'svelte-spa-router';
  import ProgramView from './views/ProgramView.svelte';
  import LiveView from './views/LiveView.svelte';
  import ControlView from './views/ControlView.svelte';
  import ShareView from './views/ShareView.svelte';
  import AdminLogin from './views/AdminLogin.svelte';
  import AdminConcerts from './views/AdminConcerts.svelte';
  import AdminEditConcert from './views/AdminEditConcert.svelte';
  import NotFound from './views/NotFound.svelte';

  const routes = {
    '/:orgSlug/:concertId': ProgramView,
    '/:orgSlug/:concertId/live': LiveView,
    '/:orgSlug/:concertId/control': ControlView,
    '/:orgSlug/:concertId/share': ShareView,
    '/admin': AdminLogin,
    '/admin/concerts': AdminConcerts,
    '/admin/concerts/:id': AdminEditConcert,
    '*': NotFound
  };
</script>

<Router {routes} />

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: #fafafa;
    color: #1a1a2e;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  :global(button) {
    cursor: pointer;
    font-family: inherit;
  }

  :global(a) {
    color: #4a47a3;
    text-decoration: none;
  }
</style>
