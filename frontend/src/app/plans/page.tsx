'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/admin/plans').then(setPlans).catch(() => setPlans([]));
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Subscription Plans</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {plans.map((plan) => (
          <div className="card" key={plan._id}>
            <h3 className="text-lg font-bold">{plan.name}</h3>
            <p className="text-brand text-xl font-semibold">₹{plan.price}</p>
            <p className="capitalize text-sm">{plan.type}</p>
            <ul className="mt-2 list-disc pl-5 text-sm">
              {plan.benefits.map((benefit: string, idx: number) => <li key={idx}>{benefit}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
