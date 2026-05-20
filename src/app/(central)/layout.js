"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useUIStore from '@/store/useUIStore';
import useAuthStore from '@/store/useAuthStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export default function CentralLayout({ children }) {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { initializeAuth, user, logout } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Hide sidebar/header on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { label: 'Law Firms', href: '/admin/firms', icon: '⚖️' },
    { label: 'Plans', href: '/admin/plans', icon: '📋' },
    { label: 'Subscriptions', href: '/admin/subscriptions', icon: '💳' },
    { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
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
          <div className="p-6">
            <h1 className="text-xl font-serif font-bold text-secondary">
              Central Admin
            </h1>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg transition-colors",
                  pathname === item.href
                    ? "bg-secondary text-primary font-bold"
                    : "hover:bg-primary-light"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-primary-light">
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
        <header className="sticky top-0 z-40 h-16 bg-white border-b border-neutral-silver flex items-center justify-between px-8">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-neutral-slate transition-colors"
          >
            {sidebarOpen ? '◀️' : '▶️'}
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-neutral-charcoal">
              {user?.name || 'Super Admin'}
            </span>
            <div className="h-8 w-8 rounded-full bg-secondary-light flex items-center justify-center text-primary font-bold">
              SA
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
