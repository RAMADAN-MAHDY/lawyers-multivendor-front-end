"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import tenantClient from '@/services/tenantClient';
import useAuthStore from '@/store/useAuthStore';

export default function AttendanceTracking() {
  const { user } = useAuthStore();
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchAttendanceData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAttendanceData = async () => {
    setIsLoading(true);
    try {
      // Fetch both history and current status
      const [historyRes, statusRes] = await Promise.all([
        tenantClient.get('/attendance/history'),
        tenantClient.get('/attendance/status')
      ]);
      
      setAttendanceLogs(historyRes.data || []);
      setIsClockedIn(statusRes.data?.isClockedIn || false);
    } catch (error) {
      toast.error('Failed to synchronize attendance data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttendanceAction = async () => {
    const action = isClockedIn ? 'clock-out' : 'clock-in';
    setIsActionLoading(true);
    
    try {
      const endpoint = `/attendance/${action}`;
      const response = await tenantClient.post(endpoint);
      
      setIsClockedIn(!isClockedIn);
      
      if (action === 'clock-in') {
        toast.success('Successfully clocked in. Have a productive day!');
      } else {
        toast.info('Successfully clocked out. Rest well!');
        // Refresh logs after clock out to see the new entry
        const historyRes = await tenantClient.get('/attendance/history');
        setAttendanceLogs(historyRes.data || []);
      }
    } catch (error) {
      const msg = error.response?.data?.message || `Failed to ${action.replace('-', ' ')}.`;
      toast.error(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary">Attendance Tracking</h1>
        <p className="text-neutral-charcoal opacity-70 italic">Monitor daily professional presence and work hours.</p>
      </div>

      {/* Clocking Card */}
      <div className="bg-primary rounded-2xl shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <span className="text-9xl text-white">⏱️</span>
        </div>
        
        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between relative z-10 gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-secondary text-xs font-bold uppercase tracking-[0.3em] mb-2">Professional Timekeeping</h2>
            <div className="text-5xl md:text-6xl font-serif font-bold text-white mb-2">
              {mounted ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
            </div>
            <p className="text-white/60 font-medium tracking-wide">
              {mounted ? currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '---'}
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            {isLoading ? (
              <div className="h-10 w-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <div className={`h-4 w-4 rounded-full animate-pulse ${isClockedIn ? 'bg-accent-success' : 'bg-accent-danger'}`}></div>
                <button
                  onClick={handleAttendanceAction}
                  disabled={isActionLoading}
                  className={`w-48 py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-3 ${
                    isClockedIn 
                    ? 'bg-accent-danger hover:bg-red-700 text-white' 
                    : 'bg-secondary hover:bg-secondary-dark text-primary'
                  }`}
                >
                  {isActionLoading ? (
                    <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>{isClockedIn ? 'Clock Out' : 'Clock In'}</span>
                      <span>{isClockedIn ? '🛑' : '🕒'}</span>
                    </>
                  )}
                </button>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
                  Status: {isClockedIn ? 'Currently Working' : 'Not Clocked In'}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Attendance Logs Table */}
      <div className="bg-white rounded-xl border border-neutral-silver shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-silver bg-neutral-slate/10 flex justify-between items-center">
          <h2 className="text-lg font-serif font-bold text-primary">Attendance History</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-xs font-bold border border-neutral-silver rounded-lg hover:bg-neutral-slate transition-colors">
              Filter by Date
            </button>
            <button className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              Export Log
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
              <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-neutral-slate text-neutral-charcoal text-[10px] uppercase tracking-[0.2em] font-black">
                <tr>
                  <th className="px-6 py-5 border-b border-neutral-silver">Staff Member</th>
                  <th className="px-6 py-5 border-b border-neutral-silver">Date</th>
                  <th className="px-6 py-5 border-b border-neutral-silver text-center">Clock In</th>
                  <th className="px-6 py-5 border-b border-neutral-silver text-center">Clock Out</th>
                  <th className="px-6 py-5 border-b border-neutral-silver text-right">Total Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-silver">
                {attendanceLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-slate/20 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-primary">{log.employeeName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-neutral-charcoal font-medium">{new Date(log.date).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-bold text-accent-success bg-accent-success/5 px-2 py-1 rounded">
                        {log.clockIn}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${!log.clockOut ? 'text-neutral-silver bg-neutral-slate' : 'text-accent-danger bg-accent-danger/5'}`}>
                        {log.clockOut || '--:--'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-primary">{log.totalHours || '0.0'} hrs</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!isLoading && attendanceLogs.length === 0 && (
            <div className="py-20 text-center bg-neutral-slate/5">
              <span className="text-4xl mb-4 block">📅</span>
              <h3 className="text-lg font-bold text-primary">No logs recorded</h3>
              <p className="text-sm text-neutral-charcoal opacity-60">Logs will appear here once staff members clock in.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
