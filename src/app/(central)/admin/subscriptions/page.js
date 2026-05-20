"use client";

import React, { useState, useEffect } from 'react';
import centralClient from '@/services/centralClient';
import { toast } from 'react-toastify';

export default function SubscriptionsManagement() {
  const [data, setData] = useState({
    mrr: '$0',
    activeSubscriptions: 0,
    churnRate: '0%',
    subscriptions: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    setIsLoading(true);
    try {
      const response = await centralClient.get('/subscriptions/status');
      setData({
        mrr: response.data?.mrr || '$0',
        activeSubscriptions: response.data?.count || 0,
        churnRate: response.data?.churnRate || '0%',
        subscriptions: response.data?.data || []
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch billing data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary">Billing & Subscriptions</h1>
        <p className="text-neutral-charcoal opacity-70">Monitor revenue streams and subscription lifecycles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-neutral-silver shadow-sm">
          <p className="text-xs font-bold text-primary uppercase tracking-widest opacity-60">MRR (Monthly Recurring Revenue)</p>
          {isLoading ? <div className="h-8 w-24 bg-neutral-slate animate-pulse rounded mt-2"></div> : <p className="text-3xl font-serif font-bold text-primary mt-2">{data.mrr}</p>}
        </div>
        <div className="bg-white p-6 rounded-xl border border-neutral-silver shadow-sm">
          <p className="text-xs font-bold text-primary uppercase tracking-widest opacity-60">Active Subscriptions</p>
          {isLoading ? <div className="h-8 w-24 bg-neutral-slate animate-pulse rounded mt-2"></div> : <p className="text-3xl font-serif font-bold text-primary mt-2">{data.activeSubscriptions}</p>}
        </div>
        <div className="bg-white p-6 rounded-xl border border-neutral-silver shadow-sm">
          <p className="text-xs font-bold text-primary uppercase tracking-widest opacity-60">Churn Rate</p>
          {isLoading ? <div className="h-8 w-24 bg-neutral-slate animate-pulse rounded mt-2"></div> : <p className={`text-3xl font-serif font-bold mt-2 ${parseFloat(data.churnRate) > 5 ? 'text-accent-danger' : 'text-accent-success'}`}>{data.churnRate}</p>}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-silver shadow-sm overflow-hidden min-h-[400px] relative">
        <div className="p-6 border-b border-neutral-silver flex justify-between items-center">
          <h2 className="text-lg font-bold text-primary">Transaction History</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-bold border border-neutral-silver rounded-lg hover:bg-neutral-slate">Export CSV</button>
          </div>
        </div>

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-slate text-neutral-charcoal text-xs uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-4">Law Firm</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Next Billing</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-silver">
                {data.subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-neutral-slate/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-primary">{sub.firmName}</td>
                    <td className="px-6 py-4 text-sm font-medium">{sub.planName}</td>
                    <td className="px-6 py-4 text-sm font-bold text-primary">${sub.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        sub.status === 'Active' ? 'bg-accent-success/10 text-accent-success' :
                        sub.status === 'Past Due' ? 'bg-accent-warning/10 text-accent-warning' :
                        'bg-accent-danger/10 text-accent-danger'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-charcoal">{new Date(sub.nextBillingDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-secondary font-bold text-xs hover:underline">View Invoice</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.subscriptions.length === 0 && (
              <div className="p-12 text-center text-neutral-charcoal opacity-50">No transactions found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
