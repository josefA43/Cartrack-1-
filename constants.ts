
import { User, Ticket, TicketStage, TicketType } from './types';

// Managers and Clients
const JASON_ID = 'm_jasonw';
const THILOSHINI_ID = 'm_thiloshinin';

const AM_NAMES = [
  "Alouette Havenga", "Andisiwe Lapi", "Anina Van Rensburg", "Antonio Max-lino", "Arabella de Meillon",
  "Ashlyne-Kay Caveney", "Bongi Kondleka", "Brandon Spandiel", "Celia Francis", "Chantal Fisher",
  "Chante Labuschagne", "Charissa Drotskie", "Charles Wagner", "Cindy Ann Burke", "Corne Gunther",
  "Corne Reichert", "Craig La Vita", "Craig Mallandain", "Darius Bronkhorst", "Desigan Veeran",
  "Desiree Schwegmann", "Enrico De Giovanni", "Gladys Claassen", "Gustav Lind", "Henrico Bekker",
  "Henriette Harrison", "Imogen Katsky", "Jade Holl", "Jade Taff", "Jared Hockaday",
  "Jeremy Beeby", "Johan van Schalkwyk", "Josh Munger", "Juanita Calitz", "Juan-Pere Duvenhage",
  "Kerusha Bechoo", "Kerwin Manuel", "Keshnee Pillay", "Kim Hing", "Lorne Adams",
  "Lorraine Slabbert", "Luke Naidoo", "Lungelo Mabena", "Luniko Fitshane", "Madiphoko Moholo",
  "Magdalena Van Der Lely", "Mandisa Mfeka", "Marcelle Kunneke", "Menziwezinto Mchunu", "Moegamad Abdussamad",
  "Moeketsi Mogapi", "Moipone Khoele", "Nadia Fivaz", "Nicole Roopen", "Nicole Zwaneopel",
  "Nina Iwuoha", "Noelene Mthiyane", "Nthabiseng Mashego", "Ntokozo Shaun Nhlapo", "Oratiloe Molefe",
  "Raigaanah Sarmie", "Regan Jansen", "Riaan Mare", "Rochelle Kapp", "Rose Nhlapo",
  "Ruan Smith", "Saddica Berriche", "Shayna Bentley", "Sherazade Hatia", "Shivani Tulsia",
  "Shiveer Ramjith", "Siyabulela Mtatase", "Subhaan Abdulla", "Tamarin Otto", "Thandile Nqwakuzayo",
  "Troskie Posthumus", "Valencia Pillay", "Vanessa Ferreira", "Vicky Ngomane", "Vumokwakhe Gazu",
  "Yashik Rambally", "Zandile Thotanyana"
];

const JASON_TEAM = [
  "Arabella de Meillon", "Brandon Spandiel", "Chantal Fisher", "Desiree Schwegmann", 
  "Enrico De Giovanni", "Moeketsi Mogapi", "Nicole Roopen", "Noelene Mthiyane", 
  "Raigaanah Sarmie", "Rose Nhlapo", "Saddica Berriche", "Siyabulela Mtatase", "Thandile Red"
];

const THILOSHINI_TEAM = [
  "Chante Labuschagne", "Craig Mallandain", "Desigan Veeran", "Jade Holl", 
  "Jeremy Beeby", "Josh Munger", "Kerwin Manuel", "Luke Naidoo", 
  "Lungelo Mabena", "Moegamad Abdussamad", "Ntokozo Shaun Nhlapo", 
  "Oratiloe Molefe", "Regan Jansen", "Zandile Thotanyana"
];

// Generate formal User objects for each AM
const AM_USERS: User[] = AM_NAMES.map((fullName, index) => {
  const parts = fullName.toLowerCase().split(' ');
  const surname = parts[parts.length - 1];
  const id = `am_${parts[0].replace(/[^a-z0-9]/g, '')}_${surname.replace(/[^a-z0-9]/g, '')}`;
  const email = `${parts[0]}.${surname}@omniticket.com`;
  
  let managerId = undefined;
  if (JASON_TEAM.includes(fullName)) managerId = JASON_ID;
  else if (THILOSHINI_TEAM.includes(fullName)) managerId = THILOSHINI_ID;

  return {
    id,
    username: fullName,
    role: 'AM',
    email,
    isOoO: false,
    managerId,
    workload: Math.floor(Math.random() * 5),
  };
});

// Assign circular backups
AM_USERS.forEach((am, index) => {
  const backupIndex = (index + 1) % AM_USERS.length;
  am.backupAMId = AM_USERS[backupIndex].id;
});

const SYSTEM_USERS: User[] = [
  { 
    id: 'u1', 
    username: 'JohnDoe', 
    role: 'Client', 
    company: 'Acme Corp', 
    email: 'john@acme.com',
    assignedAMId: AM_USERS.find(am => am.username === 'Arabella de Meillon')?.id
  },
  { 
    id: 'u2', 
    username: 'JaneSmith', 
    role: 'Client', 
    company: 'Stark Ind', 
    email: 'jane@stark.com',
    assignedAMId: AM_USERS.find(am => am.username === 'Chante Labuschagne')?.id
  },
  { id: JASON_ID, username: 'Jason Witbooi', role: 'Manager', email: 'jason.witbooi@omniticket.com' },
  { id: THILOSHINI_ID, username: 'Thiloshini Naidoo', role: 'Manager', email: 'thiloshini.naidoo@omniticket.com' },
  { id: 'm1', username: 'System Admin', role: 'Manager', email: 'admin@omniticket.com' },
];

export const USERS: User[] = [...SYSTEM_USERS, ...AM_USERS];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'JohnDoe_Newfitment_001',
    month: 'October',
    dateSent: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), 
    username: 'JohnDoe',
    company: 'Acme Corp',
    contactEmail: 'john@acme.com',
    registration: 'REG-12345',
    regEngine: 'V8-Cloud',
    type: 'New fitment',
    stage: 'Awaiting Capture',
    scheduleDate: '2023-10-25',
    assignedAMId: AM_USERS.find(am => am.username === 'Arabella de Meillon')?.id || AM_USERS[0].id,
    tcDocUrl: 'https://cdn.cartrack.com/forms/Commercial_Client_Add_Vehicle_Form_2024.pdf',
    lastUpdated: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'JaneSmith_Repair_001',
    month: 'October',
    dateSent: new Date().toISOString(),
    username: 'JaneSmith',
    company: 'Stark Ind',
    contactEmail: 'jane@stark.com',
    registration: 'REG-555',
    regEngine: 'V8-Legacy',
    type: 'Repair',
    stage: 'Testing',
    scheduleDate: '2023-10-26',
    assignedAMId: AM_USERS.find(am => am.username === 'Chante Labuschagne')?.id || AM_USERS[1].id,
    tcDocUrl: 'https://cdn.cartrack.com/forms/Standard_TandC_SA_2025.pdf',
    lastUpdated: new Date().toISOString(),
  }
];

export const TICKET_TYPES: string[] = [
  'New fitment',
  'De/Re',
  'Repair',
  'Hardlock',
  'Change of Ownership (COO)',
  'Option Change',
  'Cancellation'
];

export const FORM_MAPPINGS: Record<TicketType, { name: string, url: string }> = {
  'New fitment': { 
    name: 'Commercial Client Add Vehicle Form.pdf', 
    url: 'https://cdn.cartrack.com/forms/Commercial_Client_Add_Vehicle_Form_2024.pdf' 
  },
  'De/Re': { 
    name: 'Deinstallation_Reinstallation_Form.pdf', 
    url: 'https://cdn.cartrack.com/forms/Deinstallation_Reinstallation_Form_2020.pdf' 
  },
  'Change of Ownership (COO)': { 
    name: 'Change_of_Ownership_Form.pdf', 
    url: 'https://cdn.cartrack.com/forms/Change_of_Ownership_Form_2024.pdf' 
  },
  'Cancellation': { 
    name: 'Commercial_Cancellation_Form.pdf', 
    url: 'https://cdn.cartrack.com/forms/Commercial_Cancellation_Form_2023.pdf' 
  },
  'Repair': { 
    name: 'Standard_Terms_and_Conditions_SA.pdf', 
    url: 'https://cdn.cartrack.com/forms/Standard_TandC_SA_2025.pdf' 
  },
  'Hardlock': { 
    name: 'Standard_Terms_and_Conditions_SA.pdf', 
    url: 'https://cdn.cartrack.com/forms/Standard_TandC_SA_2025.pdf' 
  },
  'Option Change': { 
    name: 'Standard_Terms_and_Conditions_SA.pdf', 
    url: 'https://cdn.cartrack.com/forms/Standard_TandC_SA_2025.pdf' 
  }
};

export const STAGES: TicketStage[] = [
  'Awaiting Capture',
  'Sent to Capturing',
  'Testing',
  'Awaiting Scheduling',
  'Client Hold',
  'Partial Complete',
  'Company Hold',
  'Completed'
];

export interface StageDetail {
  header: string;
  description: string;
  nextAction: string;
  colorClass: string;
}

export const STAGE_CONFIG: Record<TicketStage, StageDetail> = {
  'Awaiting Capture': {
    header: 'Logged & Pending',
    description: 'Ticket created by client; awaiting capture team.',
    nextAction: 'Move to capturing team for processing.',
    colorClass: 'bg-slate-100 text-slate-700'
  },
  'Sent to Capturing': {
    header: 'In Capturing',
    description: 'Data is being actively captured/entered.',
    nextAction: 'Confirm data integrity and move to Testing or Complete.',
    colorClass: 'bg-blue-50 text-blue-700 border-blue-100'
  },
  'Testing': {
    header: 'Testing (Repairs Only)',
    description: 'Phase designated for testing repair efficacy.',
    nextAction: 'Verify results; move to Scheduling if repair failed.',
    colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-100'
  },
  'Awaiting Scheduling': {
    header: 'Repair Scheduling',
    description: 'Captures/testing failed; repair is mandatory.',
    nextAction: 'Coordinate with field team to schedule repair date.',
    colorClass: 'bg-rose-50 text-rose-700 border-rose-100'
  },
  'Client Hold': {
    header: 'On Hold (Client)',
    description: 'Work paused by client request.',
    nextAction: 'Regular follow-up with client until work resumes.',
    colorClass: 'bg-amber-50 text-amber-700 border-amber-100'
  },
  'Partial Complete': {
    header: 'Partial (De/Re)',
    description: 'De-installation is complete; Re-installation pending.',
    nextAction: 'Monitor and schedule second phase (Re-install).',
    colorClass: 'bg-cyan-50 text-cyan-700 border-cyan-100'
  },
  'Company Hold': {
    header: 'On Hold (Internal)',
    description: 'Work paused due to internal issue/escalation.',
    nextAction: 'Resolve internal blocker or consult Manager.',
    colorClass: 'bg-orange-50 text-orange-700 border-orange-100'
  },
  'Completed': {
    header: 'Finalized',
    description: 'All work finished and records updated.',
    nextAction: 'No further action required.',
    colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  }
};
