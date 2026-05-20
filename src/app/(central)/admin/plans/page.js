"use client";

import React, { useState, useEffect } from 'react';
import PlanModal from '@/components/central/plans/PlanModal';
import centralClient from '@/services/centralClient';
import { toast } from 'react-toastify';

const PlanCard = ({ plan, onEdit }) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-silver shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="p-8 border-b border-neutral-silver bg-neutral-slate/30">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-serif font-bold text-primary">{plan.name}</h3>
          {plan.activeFirmsCount > 50 && (
            <span className="bg-secondary/20 text-secondary-dark text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
              Most Popular
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-serif font-bold text-primary">${plan.price}</span>
          <span className="text-neutral-charcoal opacity-60 text-sm">/ {plan.billingCycle}</span>
        </div>
      </div>
      
      <div className="p-8 flex-1 space-y-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-charcoal font-medium">Active Law Firms</span>
          <span className="text-primary font-bold bg-secondary/10 px-3 py-1 rounded-full">{plan.activeFirmsCount}</span>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold text-primary uppercase tracking-widest opacity-60">Plan Limits</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-3 text-sm text-neutral-charcoal">
              <span className="text-secondary">✓</span> {plan.maxCases} Max Cases
            </li>
            <li className="flex items-center gap-3 text-sm text-neutral-charcoal">
              <span className="text-secondary">✓</span> {plan.storageLimit}GB Storage
            </li>
          </ul>
        </div>

        <div className="space-y-3 pt-2">
          <p className="text-xs font-bold text-primary uppercase tracking-widest opacity-60">Key Features</p>
          <ul className="space-y-2">
            {plan.features?.split(',').map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-neutral-charcoal">
                <span className="text-accent-success">✦</span> {feature.trim()}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-6 bg-neutral-slate/50">
        <button 
          onClick={() => onEdit(plan)}
          className="w-full py-3 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
        >
          Edit Plan Configuration
        </button>
      </div>
    </div>
  );
};

export default function PlansManagement() {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const response = await centralClient.get('/subscriptions');
      setPlans(response.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch plans.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleSavePlan = () => {
    fetchPlans(); // Refresh the list after save
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Subscription Tiers</h1>
          <p className="text-neutral-charcoal opacity-70">Manage pricing, feature limits, and subscription availability.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-secondary hover:bg-secondary-dark text-primary font-bold px-8 py-3 rounded-xl shadow-lg shadow-secondary/20 transition-all flex items-center gap-2"
        >
          <span className="text-xl">+</span> Create New Plan
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onEdit={handleOpenEdit} />
          ))}
        </div>
      )}

      {!isLoading && plans.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-neutral-silver">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-primary">No Plans Defined</h3>
          <p className="text-neutral-charcoal opacity-60">Get started by creating your first subscription tier.</p>
        </div>
      )}

      <PlanModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingPlan}
        onSave={handleSavePlan}
      />
    </div>
  );
}
