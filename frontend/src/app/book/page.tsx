'use client';

import { FormEvent, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export default function BookPage() {
  const [message, setMessage] = useState('');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('fixsure_token');
    const formData = new FormData(e.currentTarget);

    const res = await fetch(`${API_BASE}/services/customer/book`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token || ''}` },
      body: formData
    });

    const data = await res.json();
    setMessage(data.message || `Service booked with status: ${data.status}`);
  };

  return (
    <section className="card max-w-2xl space-y-4">
      <h2 className="text-2xl font-bold">Book a Service</h2>
      <p className="text-sm text-slate-600">Emergency request gives priority booking.</p>
      <form className="grid gap-3" onSubmit={submit}>
        <select className="input" name="category" required>
          <option value="electrician">Electrician</option>
          <option value="plumber">Plumber</option>
          <option value="ac">AC Repair</option>
          <option value="carpenter">Carpenter</option>
        </select>
        <input className="input" type="date" name="preferredDate" required />
        <input className="input" name="timeSlot" placeholder="Preferred time slot (e.g. 10AM-12PM)" required />
        <textarea className="input" name="issueDescription" placeholder="Describe the issue" required />
        <label className="text-sm font-semibold">Upload photo (optional)
          <input className="input mt-1" type="file" name="photo" accept="image/*" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="emergency" value="true" /> Emergency request
        </label>
        <button className="btn-primary" type="submit">Book Now</button>
      </form>
      {message && <p className="text-sm text-brand">{message}</p>}
    </section>
  );
}
