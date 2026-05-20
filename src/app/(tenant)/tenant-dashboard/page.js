"use client";

import React, { useState, useEffect } from 'react';
import useTenantStore from '@/store/useTenantStore';
import tenantClient from '@/services/tenantClient';
import { toast } from 'react-toastify';

const TenantStatCard = ({ title, value, icon, subtext, isLoading }) => (
  <div className="bg-white p-6 rounded-xl border border-neutral-silver shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-2">
      <span className="text-2xl">{icon || '📊'}</span>
      <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{subtext || '---'}</span>
    </div>
    <h3 className="text-neutral-charcoal opacity-60 text-xs font-bold uppercase tracking-widest">{title || 'Stat'}</h3>
    {isLoading ? (
      <div className="h-8 w-24 bg-neutral-slate animate-pulse rounded mt-1"></div>
    ) : (
      <p className="text-3xl font-serif font-bold text-primary mt-1">{value || '0'}</p>
    )}
  </div>
);

export default function TenantDashboard() {
  const { tenantInfo } = useTenantStore();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState({
    stats: [],
    hearings: [],
    updates: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await tenantClient.get('/dashboard/summary');
      setData(response.data || { stats: [], hearings: [], updates: [] });
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error(error.response?.data?.message || 'Failed to synchronize workspace data.');
      // Initialize with empty arrays to prevent mapping errors but keep layout
      setData({ stats: [], hearings: [], updates: [] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 min-h-screen">
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">
            Welcome back, Counselor
          </h1>
          <p className="text-neutral-charcoal opacity-70 italic">
            Managing <span className="text-secondary font-bold">{tenantInfo?.name || 'Your Firm'}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-primary uppercase tracking-widest opacity-50">Local Time</p>
          <p className="text-lg font-serif font-bold text-primary">
            {mounted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          [...Array(4)].map((_, i) => <TenantStatCard key={i} isLoading={true} />)
        ) : (
          data.stats && data.stats.length > 0 ? (
            data.stats.map((stat, index) => (
              <TenantStatCard key={index} {...stat} isLoading={false} />
            ))
          ) : (
            // Fallback empty states to keep UI structure
            ['Active Cases', 'Upcoming Sessions', 'Total Clients', 'Pending Invoices'].map((title, i) => (
              <TenantStatCard key={i} title={title} value="0" isLoading={false} />
            ))
          )
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Hearings */}
        <div className="bg-white rounded-xl border border-neutral-silver shadow-sm overflow-hidden min-h-[400px] relative">
          <div className="p-6 border-b border-neutral-silver flex justify-between items-center bg-neutral-slate/30">
            <h2 className="text-lg font-serif font-bold text-primary">Today's Schedule</h2>
            <button className="text-secondary font-bold text-sm hover:underline">View Calendar</button>
          </div>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50">
              <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="divide-y divide-neutral-silver">
              {data.hearings && data.hearings.length > 0 ? (
                data.hearings.map((h) => (
                  <div key={h.id} className="p-6 flex items-center gap-6 hover:bg-neutral-slate/20 transition-colors">
                    <div className="flex flex-col items-center justify-center min-w-[80px] py-2 px-3 bg-primary text-secondary rounded-lg">
                      <span className="text-xs font-bold uppercase tracking-tighter">Start</span>
                      <span className="text-sm font-bold">{h.time?.split(' ')[0] || '--'}</span>
                      <span className="text-[10px] uppercase">{h.time?.split(' ')[1] || '--'}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-primary">{h.caseName}</h4>
                      <p className="text-sm text-neutral-charcoal opacity-70">{h.courtName}</p>
                    </div>
                    <span className="px-3 py-1 rounded bg-secondary/10 text-secondary-dark text-[10px] font-bold uppercase tracking-widest">
                      {h.type}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-neutral-charcoal opacity-50">No hearings scheduled for today.</div>
              )}
            </div>
          )}
        </div>

        {/* Recent Updates */}
        <div className="bg-white rounded-xl border border-neutral-silver shadow-sm overflow-hidden min-h-[400px] relative">
          <div className="p-6 border-b border-neutral-silver flex justify-between items-center bg-neutral-slate/30">
            <h2 className="text-lg font-serif font-bold text-primary">Recent Activity</h2>
          </div>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50">
              <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {data.updates && data.updates.length > 0 ? (
                data.updates.map((u) => (
                  <div key={u.id} className="flex gap-4 relative pb-6 last:pb-0">
                    <div className="absolute left-2.5 top-8 bottom-0 w-px bg-neutral-silver last:hidden"></div>
                    <div className="h-5 w-5 rounded-full border-2 border-secondary bg-white z-10"></div>
                    <div className="flex-1">
                      <p className="text-sm text-primary font-medium leading-tight">{u.message}</p>
                      <div className="mt-2 flex items-center gap-3 text-[10px] font-bold text-neutral-charcoal opacity-50 uppercase tracking-widest">
                        <span>{u.createdAt ? new Date(u.createdAt).toLocaleTimeString() : '---'}</span>
                        <span>•</span>
                        <span>By {u.performedBy || 'System'}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-neutral-charcoal opacity-50">No recent activity recorded.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
