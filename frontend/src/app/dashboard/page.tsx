'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

type Job = {
  _id: string;
  category: string;
  status: string;
  preferredDate: string;
  timeSlot: string;
  issueDescription: string;
  warrantyExpiryDate?: string;
  rating?: number;
};

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/services/customer/dashboard').then(setData).catch((e) => setError(e.message));
  }, []);

  const rate = async (id: string) => {
    await apiFetch(`/services/customer/rate/${id}`, { method: 'PATCH', body: JSON.stringify({ rating: 5 }) });
    const updated = await apiFetch('/services/customer/dashboard');
    setData(updated);
  };

  if (error) return <p className="card text-red-600">{error}</p>;
  if (!data) return <p className="card">Loading...</p>;

  return (
    <section className="space-y-4">
      <div className="card">
        <h2 className="text-xl font-bold">Active Plan</h2>
        <p>{data.activeSubscriptionPlan}</p>
      </div>
      <div className="card">
        <h2 className="text-xl font-bold">Upcoming Service</h2>
        {data.upcomingService ? <p>{data.upcomingService.category} • {data.upcomingService.status}</p> : <p>No upcoming service.</p>}
      </div>
      <div className="card space-y-2">
        <h2 className="text-xl font-bold">Service History</h2>
        {data.serviceHistory.map((job: Job) => (
          <div className="rounded-xl border p-3" key={job._id}>
            <p className="font-semibold capitalize">{job.category} • {job.status}</p>
            <p className="text-sm text-slate-600">{job.preferredDate} ({job.timeSlot})</p>
            <p className="text-sm">{job.issueDescription}</p>
            {job.status === 'Completed' && (
              <>
                <p className="text-sm text-green-700">Warranty till: {job.warrantyExpiryDate ? new Date(job.warrantyExpiryDate).toLocaleDateString() : 'Pending'}</p>
                {!job.rating && <button className="btn mt-2 bg-slate-100" onClick={() => rate(job._id)}>Rate 5⭐</button>}
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
