
import React from 'react';
import { Ticket, User, UserRole } from '../types';
import { REGIONAL_LEADERS, USERS } from '../constants';
import { calculateSLAStatus } from '../services/ticketService';

interface ExecutiveDashboardProps {
  role: UserRole;
  tickets: Ticket[];
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ role, tickets }) => {
  const totalBreaches = tickets.filter(t => calculateSLAStatus(t) === 'Breach');
  const activeTickets = tickets.filter(t => t.stage !== 'Completed');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">{role === 'Director' ? 'Director\'s Strategic View' : 'National AM Hub'}</h2>
          <p className="text-slate-500">Aggregated system intelligence across all {REGIONAL_LEADERS.length} regions.</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Status</div>
          <div className={`text-sm font-bold px-3 py-1 rounded-full ${totalBreaches.length > 10 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {totalBreaches.length > 10 ? 'ATTENTION REQUIRED' : 'STABLE'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Volume', value: tickets.length, color: 'bg-slate-800' },
          { label: 'Active Workload', value: activeTickets.length, color: 'bg-blue-600' },
          { label: 'National Breaches', value: totalBreaches.length, color: 'bg-rose-600' },
          { label: 'Avg Cycle Time', value: '1.2d', color: 'bg-emerald-600' }
        ].map((stat, i) => (
          <div key={i} className={`${stat.color} p-6 rounded-2xl text-white shadow-lg`}>
            <p className="text-[10px] font-bold uppercase opacity-80 tracking-widest">{stat.label}</p>
            <p className="text-4xl font-black mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex justify-between items-center">
            <span>Regional Performance Ranking</span>
            <span className="text-[10px] text-slate-400 font-normal">Ranked by lowest breach %</span>
          </h3>
          <div className="space-y-6">
            {REGIONAL_LEADERS.map((leader) => {
              const teamAMs = USERS.filter(u => u.managerId === leader.id);
              const teamTickets = tickets.filter(t => teamAMs.some(am => am.id === t.assignedAMId));
              const teamBreaches = teamTickets.filter(t => calculateSLAStatus(t) === 'Breach');
              const breachRate = teamTickets.length > 0 ? (teamBreaches.length / teamTickets.length) * 100 : 0;
              
              return (
                <div key={leader.id} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-bold text-slate-600 truncate">{leader.name.split(' ')[0]}</div>
                  <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className={`h-full ${breachRate > 15 ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${100 - breachRate}%` }}></div>
                  </div>
                  <div className="w-12 text-right text-xs font-black text-slate-900">{(100 - breachRate).toFixed(0)}%</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-4">Strategic Capacity</h3>
            <p className="text-slate-400 text-sm mb-6">Real-time throughput analysis across all operational divisions.</p>
            <div className="grid grid-cols-2 gap-6">
              <div className="border-l-2 border-blue-500 pl-4">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">New Fitments</div>
                <div className="text-2xl font-black">{tickets.filter(t => t.type === 'New fitment' && t.stage !== 'Completed').length}</div>
              </div>
              <div className="border-l-2 border-amber-500 pl-4">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Repairs</div>
                <div className="text-2xl font-black">{tickets.filter(t => t.type === 'Repair' && t.stage !== 'Completed').length}</div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        </div>
      </div>
    </div>
  );
};
