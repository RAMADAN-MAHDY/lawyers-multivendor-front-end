"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import { toast } from 'react-toastify';
import tenantClient from '@/services/tenantClient';

export default function TenantLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Actual API call to tenant domain login via dynamic tenantClient
      const response = await tenantClient.post('/login', formData);
      
      const { user, access_token, role } = response.data;
      
      login(user, access_token, role || 'tenant-admin');
      toast.success('Welcome back to the firm!');
      router.push('/dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid credentials. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Left Side: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-serif font-bold text-secondary mb-6">
            Lawyers Multivendor
          </h1>
          <p className="text-xl text-gray-300 italic max-w-md mx-auto leading-relaxed">
            "Justice is the constant and perpetual will to allot to every man his due."
          </p>
          <div className="mt-12 h-1 w-24 bg-secondary mx-auto"></div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-neutral-slate">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-serif font-bold text-primary mb-2">Firm Login</h2>
            <p className="text-neutral-charcoal opacity-70">Enter your credentials to access the legal ecosystem.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-primary mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none"
                placeholder="attorney@firm.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-2 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-silver focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-neutral-silver text-secondary focus:ring-secondary cursor-pointer" />
                <span className="ml-2 text-neutral-charcoal group-hover:text-primary transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-secondary hover:text-secondary-dark font-medium transition-colors underline decoration-secondary/30">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : 'Access Portal'}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-neutral-silver text-center">
            <p className="text-sm text-neutral-charcoal">
              Trouble accessing your account? <br />
              <a href="#" className="text-primary font-bold hover:underline">Contact your Law Firm Administrator</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
