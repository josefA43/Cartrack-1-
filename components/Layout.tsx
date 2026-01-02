
import React, { useState } from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  notificationCount: number;
  onLogout: () => void;
  onRoleChange: (role: 'Client' | 'AM' | 'Manager') => void;
  onClearNotifications: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  notificationCount, 
  onLogout, 
  onRoleChange,
  onClearNotifications
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              OmniTicket
            </h1>
            <p className="text-slate-400 text-xs mt-1">Enterprise Service Portal</p>
          </div>
          
          {/* Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-400 hover:text-white transition-colors relative"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {notificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 text-slate-900 z-50 p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold uppercase text-slate-500">Alerts</h3>
                  {notificationCount > 0 && (
                    <button 
                      onClick={() => { onClearNotifications(); setShowNotifications(false); }}
                      className="text-[10px] text-blue-600 hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                {notificationCount > 0 ? (
                  <p className="text-sm text-slate-700">
                    You have <span className="font-bold text-rose-600">{notificationCount}</span> active SLA breaches requiring attention.
                  </p>
                ) : (
                  <p className="text-sm text-slate-400 italic">No new alerts.</p>
                )}
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <div className="pb-4 border-b border-slate-800">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Switch View (Dev)</p>
            <div className="flex flex-col gap-1">
              <button onClick={() => onRoleChange('Client')} className={`text-left px-3 py-1 rounded text-sm ${user.role === 'Client' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>Client Portal</button>
              <button onClick={() => onRoleChange('AM')} className={`text-left px-3 py-1 rounded text-sm ${user.role === 'AM' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>AM Dashboard</button>
              <button onClick={() => onRoleChange('Manager')} className={`text-left px-3 py-1 rounded text-sm ${user.role === 'Manager' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>Manager View</button>
            </div>
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">
              {user.username[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.username}</p>
              <p className="text-xs text-slate-400 truncate">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 rounded text-sm font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
