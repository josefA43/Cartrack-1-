
import React, { useState } from 'react';
import { Ticket, TicketType, User } from '../types';
import { TICKET_TYPES, USERS, FORM_MAPPINGS } from '../constants';
import { generateTicketId, getAssignedAM } from '../services/ticketService';

interface TicketFormProps {
  currentUser: User;
  tickets: Ticket[];
  onSubmit: (ticket: Ticket) => void;
}

export const TicketForm: React.FC<TicketFormProps> = ({ currentUser, tickets, onSubmit }) => {
  // Find the assigned AM object to display their name
  const assignedAM = USERS.find(u => u.id === currentUser.assignedAMId);
  
  const [formData, setFormData] = useState({
    type: 'New fitment' as TicketType,
    company: currentUser.company || '',
    contactEmail: currentUser.email,
    registration: '',
    scheduleDate: '',
    tcUploaded: false,
  });

  const currentForm = FORM_MAPPINGS[formData.type];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tcUploaded) return;

    const dateSent = new Date().toISOString();
    
    // Automatic Routing logic: use the assigned AM's ID, 
    // the service already handles OoO fallback.
    const finalAMId = getAssignedAM(currentUser.assignedAMId || 'TEAM_LEAD');

    const newTicket: Ticket = {
      id: generateTicketId(tickets, currentUser.username, formData.type),
      month: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date()),
      dateSent,
      username: currentUser.username,
      company: formData.company,
      contactEmail: formData.contactEmail,
      registration: formData.registration,
      regEngine: '', 
      type: formData.type,
      stage: 'Awaiting Capture',
      scheduleDate: formData.scheduleDate,
      assignedAMId: finalAMId,
      tcDocUrl: currentForm.url,
      lastUpdated: dateSent
    };

    onSubmit(newTicket);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold mb-6">Create Support Ticket</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ticket Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 text-xs uppercase tracking-wider font-bold">Ticket Type</label>
            <select 
              value={formData.type}
              onChange={(e) => {
                setFormData({...formData, type: e.target.value as TicketType, tcUploaded: false});
              }}
              className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border text-sm"
            >
              {TICKET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 text-xs uppercase tracking-wider font-bold">Company</label>
            <input 
              type="text" 
              value={formData.company}
              readOnly
              className="w-full rounded-lg bg-slate-50 border-slate-200 shadow-sm p-2.5 border text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* AUTOMATIC AM DISPLAY */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 text-xs uppercase tracking-wider font-bold">Your Account Manager</label>
            <div className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">AM</div>
              <span className="text-sm font-semibold text-blue-900">
                {assignedAM ? assignedAM.username : 'Central Support Team'}
              </span>
              {assignedAM?.isOoO && (
                <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-bold uppercase ml-auto">
                  Out of Office (Auto-Routed)
                </span>
              )}
            </div>
          </div>

          {/* Dynamic Fields */}
          {['New fitment', 'De/Re', 'Change of Ownership (COO)'].includes(formData.type) && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 text-xs uppercase tracking-wider font-bold">Username</label>
              <input 
                type="text" 
                value={formData.registration}
                onChange={(e) => setFormData({...formData, registration: e.target.value})}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border text-sm"
                placeholder="Enter account username"
                required
              />
            </div>
          )}

          {['Repair', 'Hardlock', 'Option Change', 'Cancellation'].includes(formData.type) && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1 text-xs uppercase tracking-wider font-bold">
                {formData.type === 'Cancellation' ? 'Reason for Cancellation' : 'Issue Description / Details'}
              </label>
              <textarea 
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border text-sm" 
                rows={3}
                placeholder="Please provide details..."
                required
              ></textarea>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 text-xs uppercase tracking-wider font-bold">Requested Schedule Date</label>
            <input 
              type="date" 
              value={formData.scheduleDate}
              onChange={(e) => setFormData({...formData, scheduleDate: e.target.value})}
              className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border text-sm"
              required
            />
            <p className="text-rose-600 text-[10px] mt-1 font-bold italic">Not guaranteed</p>
          </div>
        </div>

        {/* T&C Section */}
        <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Mandatory Documentation</h3>
              <p className="text-[10px] text-slate-500 font-medium">Download the form specific to your request type.</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-slate-200 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 text-rose-600 rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">{currentForm.name}</p>
                <p className="text-[10px] text-slate-400">PDF Document • {formData.type} Required Form</p>
              </div>
            </div>

            <a 
              href={currentForm.url} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Download Form
            </a>
          </div>

          <div className="relative">
            <input 
              type="file" 
              id="tc-upload" 
              className="hidden" 
              onChange={() => setFormData({...formData, tcUploaded: true})}
            />
            <label 
              htmlFor="tc-upload"
              className={`flex items-center justify-center gap-3 w-full p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                formData.tcUploaded 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/30'
              }`}
            >
              {formData.tcUploaded ? (
                <>
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-xs font-bold uppercase tracking-wide">Signed Document Uploaded Successfully</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  <span className="text-xs font-bold uppercase tracking-wide">Click to Upload Signed {formData.type} Form</span>
                </>
              )}
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={!formData.tcUploaded}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
              formData.tcUploaded 
                ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-blue-200' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            Submit Support Request
          </button>
        </div>
      </form>
    </div>
  );
};
