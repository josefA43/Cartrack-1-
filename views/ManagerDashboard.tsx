
import React, { useState } from 'react';
import { Ticket, User } from '../types';
import { USERS } from '../constants';
import { calculateSLAStatus } from '../services/ticketService';

interface ManagerDashboardProps {
  currentUser: User;
  tickets: Ticket[];
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ currentUser, tickets }) => {
  // Use 'Regional' instead of 'Manager' as it's the correct UserRole defined in types.ts
  const managers = USERS.filter(u => u.role === 'Regional' && u.id.startsWith('rl_'));
  const [selectedManagerId, setSelectedManagerId] = useState<string>(
    // Check for 'rl_' prefix and ensure managers[0] exists to avoid runtime errors
    currentUser.id.startsWith('rl_') ? currentUser.id : (managers[0]?.id || 'all')
  );

  const teamAMs = USERS.filter(u => u.role === 'AM' && u.managerId === selectedManagerId);
  const unassignedAMs = USERS.filter(u => u.role === 'AM' && !u.managerId);
  
  const activeTeamAMs = selectedManagerId === 'all' 
    ? USERS.filter(u => u.role === 'AM') 
    : teamAMs;

  const breaches = tickets.filter(t => calculateSLAStatus(t) === 'Breach');
  const teamBreaches = breaches.filter(b => 
    activeTeamAMs.some(am => am.id === b.assignedAMId)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Management Oversight</h2>
          <p className="text-slate-500">System-wide performance for {activeTeamAMs.length} Account Managers.</p>
        </div>
        
        <div className="flex gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          {managers.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedManagerId(m.id)}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                selectedManagerId === m.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {m.username.split(' ')[0]}'s Team
            </button>
          ))}
          <button
            onClick={() => setSelectedManagerId('all')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              selectedManagerId === 'all' 
                ? 'bg-slate-800 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Teams
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AM Workloads */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold mb-6 text-slate-800 flex items-center justify-between">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              Account Manager Workloads
            </span>
            <span className="text-xs font-normal text-slate-400">
              {activeTeamAMs.length} Members
            </span>
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {activeTeamAMs.length > 0 ? activeTeamAMs.map(am => {
              const count = tickets.filter(t => t.assignedAMId === am.id && t.stage !== 'Completed').length;
              const percentage = Math.min((count / 10) * 100, 100);
              return (
                <div key={am.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{am.username} {am.isOoO ? '(OoO)' : ''}</span>
                    <span className="text-slate-500 text-xs">{count} tickets active</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${count > 8 ? 'bg-rose-500' : count > 5 ? 'bg-amber-500' : 'bg-blue-500'}`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            }) : (
              <p className="text-center py-8 text-slate-400 italic">No AMs assigned to this manager.</p>
            )}
          </div>
        </div>

        {/* System Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center text-center">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Team Open Tickets</p>
            <p className="text-4xl font-extrabold text-slate-900">
              {tickets.filter(t => t.stage !== 'Completed' && (selectedManagerId === 'all' || activeTeamAMs.some(am => am.id === t.assignedAMId))).length}
            </p>
          </div>
          <div className="bg-rose-50 p-6 rounded-xl border border-rose-100 shadow-sm flex flex-col justify-center text-center">
            <p className="text-rose-600 text-[10px] font-bold uppercase tracking-widest mb-2">Team SLA Breaches</p>
            <p className="text-4xl font-extrabold text-rose-700">{teamBreaches.length}</p>
          </div>
          
          {selectedManagerId === 'all' && unassignedAMs.length > 0 && (
            <div className="col-span-2 bg-amber-50 p-4 rounded-xl border border-amber-100">
              <p className="text-amber-800 text-xs font-bold mb-1">Attention Required</p>
              <p className="text-amber-700 text-xs">
                There are <span className="font-bold">{unassignedAMs.length}</span> Account Managers currently not assigned to a specific Reporting Manager.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SLA Breach Log */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 bg-rose-50 border-b border-rose-100">
          <h3 className="font-bold text-rose-800 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            {selectedManagerId === 'all' ? 'System-Wide' : "Team"} Breach Log (Auto-Email Triggered)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ticket</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned AM</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Activity</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamBreaches.length > 0 ? teamBreaches.map(b => (
                <tr key={b.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">{b.id}</div>
                    <div className="text-xs text-slate-500">{b.company}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">
                      {USERS.find(u => u.id === b.assignedAMId)?.username || 'Unknown AM'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(b.lastUpdated).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-800 underline">Send Reminder</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">Team is stable. No active breaches.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
