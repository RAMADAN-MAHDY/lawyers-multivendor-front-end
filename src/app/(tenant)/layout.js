"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useUIStore from '@/store/useUIStore';
import useAuthStore from '@/store/useAuthStore';
import useTenantStore from '@/store/useTenantStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export default function TenantLayout({ children }) {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { initializeAuth, logout } = useAuthStore();
  const { tenantInfo, isLoadingTenant } = useTenantStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    initializeAuth();
  }, [initializeAuth]);

  // Hide sidebar/header on login and register pages
  if (pathname === '/login' || pathname === '/register') {
    return <>{children}</>;
  }

  // Prevents layout shift/flash during hydration
  if (!mounted) {
    return <div className="min-h-screen bg-neutral-slate" />;
  }

  const navItems = [
    { label: 'Dashboard', href: '/tenant-dashboard', icon: '🏠' },
    { label: 'Cases', href: '/cases', icon: '📁' },
    { label: 'Employees', href: '/employees', icon: '👥' },
    { label: 'Financials', href: '/billing', icon: '💰' },
    { label: 'Attendance', href: '/attendance', icon: '⏱️' },
    { label: 'Reports', href: '/reports', icon: '📈' },
    { label: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-slate">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white transition-transform duration-300 ease-in-out transform",
          !sidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-primary-light flex items-center gap-3">
            {isLoadingTenant ? (
              <div className="h-10 w-10 bg-white/10 animate-pulse rounded" />
            ) : tenantInfo?.logo ? (
              <img src={tenantInfo.logo} alt="Logo" className="h-10 w-10 rounded shadow-sm" />
            ) : (
              <div className="h-10 w-10 bg-secondary flex items-center justify-center rounded text-primary font-bold">
                {tenantInfo?.name?.[0] || 'L'}
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              {isLoadingTenant ? (
                <div className="h-4 w-24 bg-white/10 animate-pulse rounded" />
              ) : (
                <h1 className="text-lg font-serif font-bold truncate">
                  {tenantInfo?.name || 'Law Firm'}
                </h1>
              )}
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg transition-all duration-200",
                  pathname === item.href
                    ? "bg-secondary text-primary shadow-lg font-bold"
                    : "hover:bg-primary-light text-gray-300"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-primary-light">
            <div className={cn(
              "mb-4 px-4 py-2 rounded bg-primary-dark/50 text-[10px] uppercase tracking-wider text-secondary font-bold",
              isLoadingTenant && "animate-pulse"
            )}>
              {isLoadingTenant ? 'Loading Plan...' : (tenantInfo?.plan || 'Pro Plan')}
            </div>
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <span className="mr-3">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-300",
          sidebarOpen ? "pl-64" : "pl-0"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-neutral-slate transition-colors text-primary"
          >
            {sidebarOpen ? '◀️' : '▶️'}
          </button>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-primary italic">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-secondary overflow-hidden shadow-inner bg-neutral-slate">
              <img src="https://ui-avatars.com/api/?name=Lawyer&background=1B2A41&color=C5A059" alt="User" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
