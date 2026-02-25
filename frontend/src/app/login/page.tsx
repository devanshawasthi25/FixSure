'use client';

import { FormEvent, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function LoginPage() {
  const [message, setMessage] = useState('');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone: formData.get('phone'), password: formData.get('password') })
      });
      localStorage.setItem('fixsure_token', data.token);
      setMessage(`Welcome ${data.user.name}!`);
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  return (
    <section className="card max-w-xl space-y-4">
      <h2 className="text-2xl font-bold">Login</h2>
      <form className="space-y-3" onSubmit={submit}>
        <input className="input" name="phone" placeholder="Phone Number" required />
        <input className="input" name="password" type="password" placeholder="Password" required />
        <button className="btn-primary w-full" type="submit">Login</button>
      </form>
      {message && <p className="text-sm text-brand">{message}</p>}
    </section>
  );
}
