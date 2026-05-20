"use client";

import React, { useState, useEffect } from 'react';
import centralClient from '@/services/centralClient';
import { toast } from 'react-toastify';

const StatCard = ({ title, value, icon, change, isPositive, isLoading }) => (
  <div className="bg-white p-6 rounded-xl border border-neutral-silver shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="h-12 w-12 bg-neutral-slate rounded-lg flex items-center justify-center text-2xl">
        {icon || '📊'}
      </div>
      {!isLoading && (
        <span className={`text-sm font-bold ${isPositive ? 'text-accent-success' : 'text-accent-danger'}`}>
          {change || '0%'}
        </span>
      )}
    </div>
    <h3 className="text-neutral-charcoal opacity-60 text-sm font-bold uppercase tracking-wider">{title || 'Stat'}</h3>
    {isLoading ? (
      <div className="h-8 w-24 bg-neutral-slate animate-pulse rounded mt-1"></div>
    ) : (
      <p className="text-3xl font-serif font-bold text-primary mt-1">{value || '0'}</p>
    )}
  </div>
);

export default function CentralDashboard() {
  const [data, setData] = useState({
    stats: [],
    recentSignups: [],
    subscriptionMix: { activePlans: 0, enterprise: 0, pro: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await centralClient.get('/dashboard/summary');
      setData(response.data || { stats: [], recentSignups: [], subscriptionMix: { activePlans: 0, enterprise: 0, pro: 0 } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch dashboard summary.');
      setData({ stats: [], recentSignups: [], subscriptionMix: { activePlans: 0, enterprise: 0, pro: 0 } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 min-h-screen">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary">Executive Overview</h1>
        <p className="text-neutral-charcoal opacity-70">Welcome back, Super Admin. Here is what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          [...Array(4)].map((_, i) => <StatCard key={i} isLoading={true} />)
        ) : (
          data.stats && data.stats.length > 0 ? (
            data.stats.map((stat, index) => (
              <StatCard key={index} {...stat} isLoading={false} />
            ))
          ) : (
            ['Total Law Firms', 'Active Subscriptions', 'Pending Approvals', 'Monthly Revenue'].map((title, i) => (
              <StatCard key={i} title={title} value="0" isLoading={false} />
            ))
          )
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-silver shadow-sm overflow-hidden min-h-[400px] relative">
          <div className="p-6 border-b border-neutral-silver flex justify-between items-center">
            <h2 className="text-lg font-bold text-primary">Recent Law Firm Signups</h2>
          </div>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50">
              <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-neutral-slate text-neutral-charcoal text-xs uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4 font-bold">Firm Name</th>
                    <th className="px-6 py-4 font-bold">Owner</th>
                    <th className="px-6 py-4 font-bold">Date</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-silver">
                  {data.recentSignups && data.recentSignups.map((firm) => (
                    <tr key={firm.id} className="hover:bg-neutral-slate/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-primary">{firm.name}</td>
                      <td className="px-6 py-4 text-sm text-neutral-charcoal">{firm.ownerEmail}</td>
                      <td className="px-6 py-4 text-sm text-neutral-charcoal">{firm.createdAt ? new Date(firm.createdAt).toLocaleDateString() : '---'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          firm.status === 'Active' ? 'bg-accent-success/10 text-accent-success' :
                          firm.status === 'Pending' ? 'bg-accent-warning/10 text-accent-warning' :
                          'bg-accent-danger/10 text-accent-danger'
                        }`}>
                          {firm.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!data.recentSignups || data.recentSignups.length === 0) && (
                <div className="p-12 text-center text-neutral-charcoal opacity-50">No recent signups found.</div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-neutral-silver shadow-sm p-6 flex flex-col min-h-[400px]">
          <h2 className="text-lg font-bold text-primary mb-6">Subscription Mix</h2>
          {isLoading ? (
             <div className="flex-1 flex items-center justify-center">
                <div className="h-32 w-32 border-8 border-neutral-slate border-t-primary rounded-full animate-spin"></div>
             </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="h-48 w-48 rounded-full border-[20px] border-primary flex items-center justify-center">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-primary">{data.subscriptionMix?.activePlans || 0}</span>
                  <span className="text-[10px] text-neutral-charcoal uppercase font-bold opacity-60 tracking-tighter">Active Plans</span>
                </div>
              </div>
              <div className="mt-8 w-full grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  <span className="text-xs font-bold text-neutral-charcoal">Enterprise: {data.subscriptionMix?.enterprise || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-secondary"></div>
                  <span className="text-xs font-bold text-neutral-charcoal">Pro: {data.subscriptionMix?.pro || 0}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
