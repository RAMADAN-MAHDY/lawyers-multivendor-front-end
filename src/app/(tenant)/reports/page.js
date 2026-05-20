"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import tenantClient from '@/services/tenantClient';

/**
 * Executive Report Card component for consistent high-end data display.
 */
const ReportCard = ({ title, value, subtext, trend, isPositive, isLoading }) => (
  <div className="bg-white p-6 rounded-xl border border-neutral-silver shadow-sm">
    <h3 className="text-neutral-charcoal opacity-60 text-xs font-bold uppercase tracking-[0.2em] mb-4">{title}</h3>
    {isLoading ? (
      <div className="space-y-3">
        <div className="h-10 w-32 bg-neutral-slate animate-pulse rounded"></div>
        <div className="h-4 w-24 bg-neutral-slate animate-pulse rounded"></div>
      </div>
    ) : (
      <>
        <div className="flex items-baseline gap-2">
          <p className="text-4xl font-serif font-bold text-primary">{value}</p>
          {trend && (
            <span className={`text-xs font-bold ${isPositive ? 'text-accent-success' : 'text-accent-danger'}`}>
              {trend}
            </span>
          )}
        </div>
        <p className="text-xs text-neutral-charcoal mt-2 font-medium">{subtext}</p>
      </>
    )}
  </div>
);

export default function ReportingAnalytics() {
  const [financials, setFinancials] = useState(null);
  const [cases, setCases] = useState(null);
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [finRes, caseRes, staffRes] = await Promise.all([
        tenantClient.get('/reports/financials'),
        tenantClient.get('/reports/cases'),
        tenantClient.get('/reports/staff')
      ]);

      setFinancials(finRes.data);
      setCases(caseRes.data);
      setStaff(staffRes.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to synchronize executive reports.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary">Executive Intelligence</h1>
        <p className="text-neutral-charcoal opacity-70 italic">Performance metrics and strategic insights for the firm.</p>
      </div>

      {/* Financial Analytics Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-serif font-bold text-primary">Financial Performance</h2>
          <div className="flex-1 h-px bg-neutral-silver opacity-30"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ReportCard 
            title="Total Revenue" 
            value={financials?.totalRevenue || '$0.00'} 
            subtext="Total collected legal fees"
            trend={financials?.revenueTrend}
            isPositive={true}
            isLoading={isLoading}
          />
          <ReportCard 
            title="Outstanding Dues" 
            value={financials?.outstandingFees || '$0.00'} 
            subtext="Unpaid client invoices"
            trend={financials?.duesTrend}
            isPositive={false}
            isLoading={isLoading}
          />
          <ReportCard 
            title="Collection Rate" 
            value={`${financials?.collectionRate || 0}%`} 
            subtext="Revenue collected vs. billed"
            isLoading={isLoading}
          />
        </div>

        {/* Revenue vs Expense Visualization Placeholder */}
        <div className="bg-white p-8 rounded-xl border border-neutral-silver shadow-sm">
           <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-6 opacity-60">Revenue vs. Operational Costs</h4>
           <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-primary">
                  <span>Revenue Collected</span>
                  <span>{financials?.collectionRate || 0}%</span>
                </div>
                <div className="w-full h-3 bg-neutral-slate rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${isLoading ? 0 : financials?.collectionRate || 0}%` }}
                   ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-accent-danger">
                  <span>Outstanding Balances</span>
                  <span>{100 - (financials?.collectionRate || 0)}%</span>
                </div>
                <div className="w-full h-3 bg-neutral-slate rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-accent-danger transition-all duration-1000" 
                    style={{ width: `${isLoading ? 0 : 100 - (financials?.collectionRate || 0)}%` }}
                   ></div>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* Operational Case Analytics Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-serif font-bold text-primary">Case Performance Metrics</h2>
          <div className="flex-1 h-px bg-neutral-silver opacity-30"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-primary p-6 rounded-xl text-white shadow-lg shadow-primary/20">
            <h3 className="text-secondary text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Success Rate</h3>
            {isLoading ? (
              <div className="h-10 w-20 bg-white/10 animate-pulse rounded"></div>
            ) : (
              <p className="text-4xl font-serif font-bold">{cases?.successRate || 0}%</p>
            )}
            <p className="text-[10px] mt-2 opacity-60 font-medium">Of total closed cases</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-neutral-silver shadow-sm">
            <h3 className="text-accent-success text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Cases Won</h3>
            <p className="text-3xl font-serif font-bold text-primary">{isLoading ? '--' : cases?.wonCount || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-neutral-silver shadow-sm">
            <h3 className="text-accent-danger text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Cases Lost</h3>
            <p className="text-3xl font-serif font-bold text-primary">{isLoading ? '--' : cases?.lostCount || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-neutral-silver shadow-sm">
            <h3 className="text-accent-warning text-[10px] font-bold uppercase tracking-[0.2em] mb-2">In Appeal</h3>
            <p className="text-3xl font-serif font-bold text-primary">{isLoading ? '--' : cases?.appealedCount || 0}</p>
          </div>
        </div>
      </section>

      {/* Staff Performance Section */}
      <section className="space-y-6 pb-12">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-serif font-bold text-primary">Workload Distribution</h2>
          <div className="flex-1 h-px bg-neutral-silver opacity-30"></div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-silver shadow-sm overflow-hidden min-h-[300px] relative">
          <div className="p-6 border-b border-neutral-silver bg-neutral-slate/10">
            <h4 className="text-sm font-bold text-primary uppercase tracking-widest opacity-60">Active Case Allocation by Associate</h4>
          </div>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
              <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {staff.map((member) => (
                  <div key={member.id} className="flex items-center gap-6 p-4 rounded-lg hover:bg-neutral-slate/30 transition-colors">
                    <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold border border-secondary/20">
                      {member.name?.[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-primary">{member.name}</span>
                        <span className="text-xs font-bold text-neutral-charcoal">{member.activeCases} Cases</span>
                      </div>
                      <div className="w-full h-2 bg-neutral-slate rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-secondary transition-all duration-1000" 
                          style={{ width: `${(member.activeCases / (cases?.totalActive || 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
                {staff.length === 0 && (
                  <div className="col-span-2 py-12 text-center text-neutral-charcoal opacity-50">No workload data available.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
