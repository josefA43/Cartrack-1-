
import { User, Ticket, TicketStage, TicketType } from './types';

// Management Layers
export const REGIONAL_LEADERS = [
  { id: 'rl_alwyn', name: 'Alwyn Grobler' },
  { id: 'rl_daniel', name: 'Daniel Jacobs' },
  { id: 'rl_genen', name: 'Genen Richter' },
  { id: 'rl_jason', name: 'Jason Witbooi' },
  { id: 'rl_sherezaad', name: 'Sherezaad Sahabodien' },
  { id: 'rl_tamzin', name: 'Tamzin Ball' },
  { id: 'rl_thiloshini', name: 'Thiloshini Naidoo' }
];

// Map of AMs to their Regional Leaders
const TEAM_MAP: Record<string, string> = {
  // Alwyn Team
  "Troskie Posthumus": "rl_alwyn", "Alouette Havenga": "rl_alwyn", "Antonio Max-lino": "rl_alwyn",
  "Magdalena Van Der Lely": "rl_alwyn", "Marcelle Kunneke": "rl_alwyn", "Moipone Khoele": "rl_alwyn",
  "Nicole Zwaneopel": "rl_alwyn",
  // Daniel Team
  "Lerato Chauke": "rl_daniel", "Lorne Adams": "rl_daniel", "Tamarin Otto": "rl_daniel",
  "Vanessa Ferreira": "rl_daniel", "Nthabiseng Mashego": "rl_daniel", "Ruan Smith": "rl_daniel",
  "Vicky Ngomane": "rl_daniel", "Gustav Lind": "rl_daniel", "Juan-Pere Duvenhage": "rl_daniel", "Riaan Mare": "rl_daniel",
  // Genen Team
  "Ashlyne-Kay Caveney": "rl_genen", "Gladys Claassen": "rl_genen", "Jade Taff": "rl_genen",
  "Jared Hockaday": "rl_genen", "Kim Hing": "rl_genen", "Rochelle Kapp": "rl_genen",
  "Shayna Bentley": "rl_genen", "Luniko Fitshane": "rl_genen", "Lorraine Slabbert": "rl_genen",
  "Cindy Ann Burke": "rl_genen", "Craig La Vita": "rl_genen",
  // Jason Team
  "Arabella de Meillon": "rl_jason", "Brandon Spandiel": "rl_jason", "Chantal Fisher": "rl_jason",
  "Desiree Schwegmann": "rl_jason", "Enrico De Giovanni": "rl_jason", "Moeketsi Mogapi": "rl_jason",
  "Nicole Roopen": "rl_jason", "Noelene Mthiyane": "rl_jason", "Raigaanah Sarmie": "rl_jason",
  "Rose Nhlapo": "rl_jason", "Saddica Berriche": "rl_jason", "Siyabulela Mtatase": "rl_jason", "Thandile Nqwakuzayo": "rl_jason",
  // Sherezaad Team
  "Charles Wagner": "rl_sherezaad", "Corne Reichert": "rl_sherezaad", "Madiphoko Moholo": "rl_sherezaad",
  "Andisiwe Lapi": "rl_sherezaad", "Corne Gunther": "rl_sherezaad", "Darius Bronkhorst": "rl_sherezaad",
  "Henrico Bekker": "rl_sherezaad", "Henriette Harrison": "rl_sherezaad", "Juanita Calitz": "rl_sherezaad",
  "Nina Iwuoha": "rl_sherezaad", "Sherazade Hatia": "rl_sherezaad", "Imogen Katsky": "rl_sherezaad", "Nadia Fivaz": "rl_sherezaad",
  // Tamzin Team
  "Celia Francis": "rl_tamzin", "Kerusha Bechoo": "rl_tamzin", "Keshnee Pillay": "rl_tamzin",
  "Menziwezinto Mchunu": "rl_tamzin", "Shivani Tulsia": "rl_tamzin", "Shiveer Ramjith": "rl_tamzin",
  "Subhaan Abdulla": "rl_tamzin", "Valencia Pillay": "rl_tamzin", "Vumokwakhe Gazu": "rl_tamzin",
  "Yashik Rambally": "rl_tamzin", "Johan van Schalkwyk": "rl_tamzin", "Mandisa Mfeka": "rl_tamzin",
  // Thiloshini Team
  "Chante Labuschagne": "rl_thiloshini", "Craig Mallandain": "rl_thiloshini", "Desigan Veeran": "rl_thiloshini",
  "Jade Holl": "rl_thiloshini", "Jeremy Beeby": "rl_thiloshini", "Josh Munger": "rl_thiloshini",
  "Kerwin Manuel": "rl_thiloshini", "Luke Naidoo": "rl_thiloshini", "Lungelo Mabena": "rl_thiloshini",
  "Moegamad Abdussamad": "rl_thiloshini", "Ntokozo Shaun Nhlapo": "rl_thiloshini", "Oratiloe Molefe": "rl_thiloshini",
  "Regan Jansen": "rl_thiloshini"
};

const AM_NAMES = Object.keys(TEAM_MAP);

// Generate formal User objects for each AM
const AM_USERS: User[] = AM_NAMES.map((fullName, index) => {
  const parts = fullName.toLowerCase().split(' ');
  const id = `am_${parts[0].replace(/[^a-z0-9]/g, '')}_${index}`;
  const email = `${parts[0]}@omniticket.com`;
  
  return {
    id,
    username: fullName,
    role: 'AM',
    email,
    isOoO: false,
    managerId: TEAM_MAP[fullName],
    workload: Math.floor(Math.random() * 8),
  };
});

// National & Director users
const EXECUTIVE_USERS: User[] = [
  { id: 'nat_1', username: 'National AM Hub', role: 'National', email: 'national.hub@omniticket.com' },
  { id: 'dir_1', username: 'Executive Director', role: 'Director', email: 'director@omniticket.com' }
];

// Regional Lead users
const REGIONAL_USERS: User[] = REGIONAL_LEADERS.map(rl => ({
  id: rl.id,
  username: rl.name,
  role: 'Regional',
  email: `${rl.name.toLowerCase().replace(' ', '.')}@omniticket.com`
}));

const SYSTEM_USERS: User[] = [
  { 
    id: 'u1', 
    username: 'JohnDoe', 
    role: 'Client', 
    company: 'Acme Corp', 
    email: 'john@acme.com',
    assignedAMId: AM_USERS.find(am => am.username === 'Arabella de Meillon')?.id
  }
];

export const USERS: User[] = [...SYSTEM_USERS, ...AM_USERS, ...REGIONAL_USERS, ...EXECUTIVE_USERS];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'JohnDoe_Newfitment_001',
    month: 'October',
    dateSent: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), 
    username: 'JohnDoe',
    company: 'Acme Corp',
    contactEmail: 'john@acme.com',
    registration: 'REG-123',
    regEngine: 'V8',
    type: 'New fitment',
    stage: 'Awaiting Capture',
    scheduleDate: '2023-11-01',
    assignedAMId: AM_USERS.find(am => am.username === 'Arabella de Meillon')?.id || AM_USERS[0].id,
    tcDocUrl: '#',
    lastUpdated: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  }
];

export const TICKET_TYPES: TicketType[] = [
  'New fitment', 'De/Re', 'Repair', 'Hardlock', 'Change of Ownership (COO)', 'Option Change', 'Cancellation'
];

export const FORM_MAPPINGS: Record<TicketType, { name: string, url: string }> = {
  'New fitment': { name: 'Add_Vehicle_Form.pdf', url: '#' },
  'De/Re': { name: 'Deinstallation_Form.pdf', url: '#' },
  'Change of Ownership (COO)': { name: 'COO_Form.pdf', url: '#' },
  'Cancellation': { name: 'Cancellation_Form.pdf', url: '#' },
  'Repair': { name: 'T&C_SA.pdf', url: '#' },
  'Hardlock': { name: 'T&C_SA.pdf', url: '#' },
  'Option Change': { name: 'T&C_SA.pdf', url: '#' }
};

export const STAGES: TicketStage[] = [
  'Awaiting Capture', 'Sent to Capturing', 'Testing', 'Awaiting Scheduling', 
  'Client Hold', 'Partial Complete', 'Company Hold', 'Completed'
];

export const STAGE_CONFIG: Record<TicketStage, { header: string; description: string; nextAction: string; colorClass: string; }> = {
  'Awaiting Capture': { header: 'Logged', description: 'Pending capture.', nextAction: 'Move to capturing.', colorClass: 'bg-slate-100 text-slate-700' },
  'Sent to Capturing': { header: 'In Process', description: 'Data entry phase.', nextAction: 'Verify data.', colorClass: 'bg-blue-50 text-blue-700 border-blue-100' },
  'Testing': { header: 'Testing', description: 'Verifying repair.', nextAction: 'Confirm fix.', colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
  'Awaiting Scheduling': { header: 'Scheduling', description: 'Booking technician.', nextAction: 'Call client.', colorClass: 'bg-rose-50 text-rose-700 border-rose-100' },
  'Client Hold': { header: 'Client Hold', description: 'Waiting for client.', nextAction: 'Follow up.', colorClass: 'bg-amber-50 text-amber-700 border-amber-100' },
  'Partial Complete': { header: 'Partial', description: 'Phase 1 done.', nextAction: 'Schedule Phase 2.', colorClass: 'bg-cyan-50 text-cyan-700 border-cyan-100' },
  'Company Hold': { header: 'Internal Hold', description: 'Internal blocker.', nextAction: 'Escalate.', colorClass: 'bg-orange-50 text-orange-700 border-orange-100' },
  'Completed': { header: 'Finalized', description: 'Closed.', nextAction: 'None.', colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-100' }
};
