
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

export type UserRole = 'Client' | 'AM' | 'Regional' | 'National' | 'Director';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  company?: string;
  email: string;
  isOoO?: boolean;
  backupAMId?: string;
  assignedAMId?: string; 
  managerId?: string; 
  workload?: number;
}

export interface Ticket {
  id: string;
  month: string;
  dateSent: string;
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
  lastUpdated: string;
}

export interface SLABreach {
  ticketId: string;
  assignedAM: string;
  hoursOpen: number;
  managerNotified: boolean;
}
