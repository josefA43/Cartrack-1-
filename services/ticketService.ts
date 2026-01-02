
import { Ticket, TicketType, User } from '../types';
import { USERS } from '../constants';

export const generateTicketId = (tickets: Ticket[], username: string, type: TicketType): string => {
  const count = tickets.filter(t => t.username === username && t.type === type).length;
  const sequential = String(count + 1).padStart(3, '0');
  const typeClean = type.replace(/\s+/g, '');
  return `${username}_${typeClean}_${sequential}`;
};

export const getAssignedAM = (requestedAMId: string): string => {
  const am = USERS.find(u => u.id === requestedAMId);
  if (!am || am.role !== 'AM') return 'TEAM_LEAD';

  if (am.isOoO) {
    if (am.backupAMId) {
      const backup = USERS.find(u => u.id === am.backupAMId);
      return backup && !backup.isOoO ? backup.id : 'TEAM_LEAD';
    }
    return 'TEAM_LEAD';
  }
  return am.id;
};

/**
 * SLA Breach check: 
 * Returns 'Breach' if the ticket is NOT 'Completed' 
 * AND has not been updated in over 24 hours.
 */
export const calculateSLAStatus = (ticket: Ticket): 'Normal' | 'Breach' => {
  if (ticket.stage === 'Completed') return 'Normal';
  
  const lastUpdate = new Date(ticket.lastUpdated);
  const now = new Date();
  const diffHours = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
  
  return diffHours > 24 ? 'Breach' : 'Normal';
};

export const getDaysOpen = (dateSent: string): number => {
  const sentDate = new Date(dateSent);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - sentDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
