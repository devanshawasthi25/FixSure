'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function AdminPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const [m, j, t, c] = await Promise.all([
        apiFetch('/admin/metrics'),
        apiFetch('/services/admin/jobs'),
        apiFetch('/admin/technicians'),
        apiFetch('/admin/complaints')
      ]);
      setMetrics(m);
      setJobs(j);
      setTechnicians(t);
      setComplaints(c);
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  useEffect(() => { load(); }, []);

  const createPlan = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await apiFetch('/admin/plans', {
      method: 'POST',
      body: JSON.stringify({
        name: f.get('name'),
        type: f.get('type'),
        price: Number(f.get('price')),
        benefits: String(f.get('benefits')).split(',').map((v) => v.trim())
      })
    });
    setMessage('Plan saved');
  };

  const assign = async (jobId: string, technicianId: string) => {
    await apiFetch(`/services/admin/jobs/${jobId}/assign`, { method: 'PATCH', body: JSON.stringify({ technicianId }) });
    load();
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      {message && <p className="card text-brand">{message}</p>}
      {metrics && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="card"><p>Total users</p><p className="text-2xl font-bold">{metrics.totalUsers}</p></div>
          <div className="card"><p>Active subscriptions</p><p className="text-2xl font-bold">{metrics.activeSubscriptions}</p></div>
          <div className="card"><p>Pending jobs</p><p className="text-2xl font-bold">{metrics.pendingJobs}</p></div>
        </div>
      )}

      <form className="card grid gap-2" onSubmit={createPlan}>
        <h2 className="font-bold">Manage Subscription Plan</h2>
        <input className="input" name="name" placeholder="Plan name" required />
        <select className="input" name="type"><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select>
        <input className="input" name="price" type="number" placeholder="Price" required />
        <input className="input" name="benefits" placeholder="Benefits comma separated" required />
        <button className="btn-primary" type="submit">Save Plan</button>
      </form>

      <div className="card space-y-2">
        <h2 className="font-bold">Assign Technician</h2>
        {jobs.map((job) => (
          <div className="rounded-xl border p-3" key={job._id}>
            <p className="font-semibold capitalize">{job.category} • {job.status}</p>
            <p className="text-sm">Customer: {job.customer?.name}</p>
            <select className="input mt-2" onChange={(e) => assign(job._id, e.target.value)} defaultValue="">
              <option value="" disabled>Select technician</option>
              {technicians.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="font-bold">Customer Complaints</h2>
        {complaints.map((c) => <p key={c._id} className="text-sm">{c.message} ({c.status})</p>)}
      </div>
    </section>
  );
}
