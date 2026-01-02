
import React, { useState } from 'react';
import { User, Ticket, TicketStage } from '../types';
import { calculateSLAStatus, getDaysOpen } from '../services/ticketService';
import { STAGES, STAGE_CONFIG, USERS } from '../constants';

interface AMDashboardProps {
  user: User;
  tickets: Ticket[];
  onUpdateTicket: (id: string, stage: TicketStage) => void;
  onToggleStatus: (backupId?: string) => void;
}

export const AMDashboard: React.FC<AMDashboardProps> = ({ user, tickets, onUpdateTicket, onToggleStatus }) => {
  const amTickets = tickets.filter(t => t.assignedAMId === user.id);
  const [showOoOModal, setShowOoOModal] = useState(false);
  const [selectedBackupId, setSelectedBackupId] = useState('');

  const otherAMs = USERS.filter(u => u.role === 'AM' && u.id !== user.id);

  const handleStatusClick = () => {
    if (!user.isOoO) {
      // User is currently Available, opening modal to go OoO
      setShowOoOModal(true);
      // Default selection to first available if none
      if (!selectedBackupId && otherAMs.length > 0) {
        setSelectedBackupId(otherAMs[0].id);
      }
    } else {
      // User is already OoO, toggle back to Available directly
      onToggleStatus();
    }
  };

  const confirmOoO = () => {
    onToggleStatus(selectedBackupId);
    setShowOoOModal(false);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold">My Workspace</h2>
          <p className="text-slate-500">Manage your active assignments and availability.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
          <span className="text-sm font-medium text-slate-600">Availability:</span>
          <button 
            onClick={handleStatusClick}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold transition-all ${
              !user.isOoO ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-rose-500 text-white shadow-rose-200'
            } shadow-lg`}
          >
            <div className={`w-2 h-2 rounded-full bg-white animate-pulse`}></div>
            {user.isOoO ? 'Out of Office' : 'Available'}
          </button>
        </div>
      </div>

      {/* OoO Backup Selection Modal */}
      {showOoOModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 p-6 text-white">
              <h3 className="text-lg font-bold">Go Out of Office</h3>
              <p className="text-slate-400 text-sm mt-1">Please designate a backup Account Manager to handle your ticket routing while you are away.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Designated Backup AM</label>
                <select 
                  value={selectedBackupId}
                  onChange={(e) => setSelectedBackupId(e.target.value)}
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border text-sm"
                >
                  <option value="" disabled>Select a backup colleague...</option>
                  {otherAMs.map(am => (
                    <option key={am.id} value={am.id}>
                      {am.username} {am.isOoO ? '(Also OoO)' : ''}
                    </option>
                  ))}
                </select>
                {otherAMs.find(a => a.id === selectedBackupId)?.isOoO && (
                  <p className="mt-2 text-xs text-amber-600 flex items-center gap-1 font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    Warning: The selected backup is currently Out of Office.
                  </p>
                )}
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowOoOModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmOoO}
                  disabled={!selectedBackupId}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200"
                >
                  Confirm & Go OoO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 p-6 rounded-xl text-white shadow-md">
          <p className="text-blue-100 text-sm font-medium text-blue-100/80">Active Tickets</p>
          <p className="text-3xl font-bold">{amTickets.filter(t => t.stage !== 'Completed').length}</p>
        </div>
        <div className="bg-emerald-500 p-6 rounded-xl text-white shadow-md">
          <p className="text-emerald-50 text-sm font-medium text-emerald-50/80">Resolved This Month</p>
          <p className="text-3xl font-bold">{amTickets.filter(t => t.stage === 'Completed').length}</p>
        </div>
        <div className="bg-amber-500 p-6 rounded-xl text-white shadow-md">
          <p className="text-amber-50 text-sm font-medium text-amber-50/80">SLA At Risk</p>
          <p className="text-3xl font-bold">
            {amTickets.filter(t => calculateSLAStatus(t) === 'Breach').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Priority Backlog</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client / ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Workflow Phase</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">SLA Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Next Action</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {amTickets.map(ticket => {
                const sla = calculateSLAStatus(ticket);
                const config = STAGE_CONFIG[ticket.stage];
                return (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{ticket.company}</div>
                      <div className="text-xs text-slate-500">{ticket.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1 border ${config.colorClass}`}>
                        {config.header}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-[150px]">{config.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        sla === 'Breach' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {sla === 'Breach' ? 'SLA BREACH' : 'ON TRACK'}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">{getDaysOpen(ticket.dateSent)}d since sent</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 italic">
                        "{config.nextAction}"
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={ticket.stage}
                        onChange={(e) => onUpdateTicket(ticket.id, e.target.value as TicketStage)}
                        className="text-xs border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500 bg-white p-1"
                      >
                        {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
