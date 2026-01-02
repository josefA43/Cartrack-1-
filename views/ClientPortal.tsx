
import React, { useState } from 'react';
import { User, Ticket } from '../types';
import { TicketForm } from '../components/TicketForm';
import { getDaysOpen } from '../services/ticketService';
import { STAGE_CONFIG } from '../constants';

interface ClientPortalProps {
  user: User;
  tickets: Ticket[];
  addTicket: (ticket: Ticket) => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ user, tickets, addTicket }) => {
  const [showForm, setShowForm] = useState(false);
  const myTickets = tickets.filter(t => t.username === user.username);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Portal: {user.company}</h2>
          <p className="text-slate-500">Track and manage your organization's support requests.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
        >
          {showForm ? '← Back to History' : '+ New Request'}
        </button>
      </div>

      {showForm ? (
        <TicketForm currentUser={user} tickets={tickets} onSubmit={(t) => { addTicket(t); setShowForm(false); }} />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Service Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Processing Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cycle Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Your AM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myTickets.length > 0 ? myTickets.map(ticket => {
                  const config = STAGE_CONFIG[ticket.stage];
                  return (
                    <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-900">{ticket.id}</div>
                        <div className="text-xs text-slate-500">Sent: {new Date(ticket.dateSent).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                          {ticket.type}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${config.colorClass}`}>
                          {config.header}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 italic">{config.description}</p>
                      </td>
                      <td className="px-6 py-5 text-slate-600 text-sm font-medium">
                        {getDaysOpen(ticket.dateSent)} Day(s)
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 border border-blue-200">
                            AM
                          </div>
                          <span className="text-sm text-slate-700 font-medium">{ticket.assignedAMId}</span>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        <p className="text-sm font-medium">No history found yet.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
