
export type TicketType = 
  | 'New fitment' 
  | 'De/Re' 
  | 'Repair' 
  | 'Hardlock' 
  | 'Change of Ownership (COO)' 
  | 'Option Change' 
  | 'Cancellation';

export type TicketStage = 
  | 'Awaiting Capture' 
  | 'Sent to Capturing' 
  | 'Testing' 
  | 'Awaiting Scheduling' 
  | 'Client Hold' 
  | 'Partial Complete' 
  | 'Company Hold' 
  | 'Completed';

export interface User {
  id: string;
  username: string;
  role: 'Client' | 'AM' | 'Manager';
  company?: string;
  email: string;
  isOoO?: boolean;
  backupAMId?: string;
  assignedAMId?: string; // For Clients: Links them to a specific AM
  managerId?: string; // ID of the manager this AM reports to
  workload?: number;
}

export interface Ticket {
  id: string; // Username_Type_Sequential
  month: string;
  dateSent: string; // ISO String
  username: string;
  company: string;
  contactEmail: string;
  registration: string;
  regEngine: string;
  type: TicketType;
  stage: TicketStage;
  scheduleDate: string;
  assignedAMId: string;
  tcDocUrl: string;
  lastUpdated: string; // ISO String
}

export interface SLABreach {
  ticketId: string;
  assignedAM: string;
  hoursOpen: number;
  managerNotified: boolean;
}
