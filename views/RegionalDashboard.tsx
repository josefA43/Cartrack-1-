
import React from 'react';
import { Ticket, User } from '../types';
import { USERS } from '../constants';
import { calculateSLAStatus } from '../services/ticketService';

interface RegionalDashboardProps {
  currentUser: User;
  tickets: Ticket[];
}

export const RegionalDashboard: React.FC<RegionalDashboardProps> = ({ currentUser, tickets }) => {
  const teamAMs = USERS.filter(u => u.role === 'AM' && u.managerId === currentUser.id);
  const teamTickets = tickets.filter(t => teamAMs.some(am => am.id === t.assignedAMId));
  const breaches = teamTickets.filter(t => calculateSLAStatus(t) === 'Breach');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Regional AM View: {currentUser.username}</h2>
          <p className="text-slate-500">Managing a team of {teamAMs.length} Account Managers.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-center shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Team Breaches</div>
            <div className={`text-xl font-bold ${breaches.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{breaches.length}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold mb-6 text-slate-800">Team Workload Distribution</h3>
          <div className="space-y-5 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
            {teamAMs.map(am => {
              const count = tickets.filter(t => t.assignedAMId === am.id && t.stage !== 'Completed').length;
              const pct = Math.min((count / 15) * 100, 100);
              return (
                <div key={am.id}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-bold text-slate-700">{am.username}</span>
                    <span className="text-slate-500 font-medium">{count} active tickets</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className={`h-full transition-all duration-700 ${count > 10 ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-rose-50 p-6 rounded-xl border border-rose-100 flex flex-col h-full">
          <h3 className="font-bold text-rose-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Critical Escalations
          </h3>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {breaches.length > 0 ? breaches.map(b => (
              <div key={b.id} className="bg-white p-3 rounded-lg border border-rose-200 shadow-sm">
                <div className="font-bold text-slate-900 text-xs">{b.id}</div>
                <div className="text-[10px] text-slate-500">AM: {teamAMs.find(a => a.id === b.assignedAMId)?.username}</div>
                <button className="mt-2 w-full py-1.5 bg-rose-600 text-white text-[10px] font-bold rounded uppercase tracking-wider hover:bg-rose-700 transition-colors">Nudge AM</button>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                <p className="text-xs font-bold text-rose-900">Queue is Healthy</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
