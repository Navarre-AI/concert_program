<script>
  import { push } from 'svelte-spa-router';
  import { adminLogin } from '../lib/api.js';
  import { adminToken } from '../lib/stores.js';

  let email = $state('');
  let password = $state('');
  let error = $state('');

  // If already logged in, redirect
  if ($adminToken) {
    push('/admin/concerts');
  }

  async function handleLogin(e) {
    e.preventDefault();
    error = '';
    try {
      const result = await adminLogin(email, password);
      adminToken.set(result.token);
      push('/admin/concerts');
    } catch (e) {
      error = e.message || 'Login failed';
    }
  }
</script>

<div class="admin-login">
  <div class="login-card">
    <h1>Concert Program</h1>
    <h2>Admin Login</h2>

    <form onsubmit={handleLogin}>
      <label>
        <span>Email</span>
        <input type="email" bind:value={email} required autofocus />
      </label>
      <label>
        <span>Password</span>
        <input type="password" bind:value={password} required />
      </label>
      {#if error}<p class="error">{error}</p>{/if}
      <button type="submit" class="btn-login">Log In</button>
    </form>
  </div>
</div>

<style>
  .admin-login {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    padding: 1rem;
  }
  .login-card {
    width: 100%;
    max-width: 380px;
    background: #fff;
    border-radius: 12px;
    padding: 2.5rem 2rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    text-align: center;
  }
  h1 {
    font-size: 1.1rem;
    font-weight: 400;
    color: #4a47a3;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 0.25rem;
  }
  h2 {
    font-size: 1.5rem;
    font-weight: 300;
    margin-bottom: 1.5rem;
    color: #1a1a2e;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-align: left;
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
  input {
    padding: 0.7rem 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
  }
  input:focus {
    outline: none;
    border-color: #4a47a3;
    box-shadow: 0 0 0 2px rgba(74, 71, 163, 0.15);
  }
  .error {
    color: #c44;
    font-size: 0.85rem;
    text-align: center;
  }
  .btn-login {
    padding: 0.75rem;
    background: #4a47a3;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    margin-top: 0.5rem;
  }
  .btn-login:active {
    background: #3d3a8a;
  }
</style>
