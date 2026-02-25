'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function TechnicianPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  const load = () => apiFetch('/services/technician/jobs').then(setJobs).catch((e) => setMessage(e.message));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await apiFetch(`/services/technician/jobs/${id}`, { method: 'PATCH', body: JSON.stringify({ status, materialCost: 250 }) });
    load();
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Technician Jobs</h1>
      {message && <p className="card text-red-600">{message}</p>}
      {jobs.map((job) => (
        <div className="card" key={job._id}>
          <p className="font-semibold capitalize">{job.category} • {job.status}</p>
          <p className="text-sm">Customer: {job.customer?.name} ({job.customer?.phone})</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="btn bg-slate-100" onClick={() => updateStatus(job._id, 'On the way')}>On the way</button>
            <button className="btn bg-green-100" onClick={() => updateStatus(job._id, 'Completed')}>Mark complete</button>
            <button className="btn bg-rose-100" onClick={() => updateStatus(job._id, 'Rejected')}>Reject</button>
          </div>
        </div>
      ))}
    </section>
  );
}
