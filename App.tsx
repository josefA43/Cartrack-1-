
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { User, Ticket, TicketStage } from './types';
import { USERS, INITIAL_TICKETS } from './constants';
import { ClientPortal } from './views/ClientPortal';
import { AMDashboard } from './views/AMDashboard';
import { ManagerDashboard } from './views/ManagerDashboard';
import { calculateSLAStatus } from './services/ticketService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(USERS[0]);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [users, setUsers] = useState<User[]>(USERS);
  const [notifications, setNotifications] = useState<string[]>([]);
  
  // Track known breaches to avoid duplicate log triggers
  const knownBreaches = useRef<Set<string>>(new Set());

  // Background SLA Monitoring Job (Simulated Cron)
  useEffect(() => {
    const runSLACheck = () => {
      console.log("[SLA Job] Scanning system for breaches...");
      
      const currentBreaches = tickets.filter(t => calculateSLAStatus(t) === 'Breach');
      
      currentBreaches.forEach(ticket => {
        if (!knownBreaches.current.has(ticket.id)) {
          // New breach detected!
          const msg = `SLA BREACH: Ticket ${ticket.id} has not been updated in 24h. Notifications sent to Manager and AM.`;
          console.warn(`[EMAIL TRIGGER] To: manager@omniticket.com, AM-${ticket.assignedAMId}. Subject: ${msg}`);
          
          setNotifications(prev => [...prev, msg]);
          knownBreaches.current.add(ticket.id);
        }
      });
    };

    // Initial check
    runSLACheck();

    // Set interval for automated checking
    const interval = setInterval(runSLACheck, 30000);
    return () => clearInterval(interval);
  }, [tickets]);

  const handleRoleChange = (role: 'Client' | 'AM' | 'Manager') => {
    let newUser: User;
    if (role === 'Client') newUser = users.find(u => u.role === 'Client')!;
    else if (role === 'AM') newUser = users.find(u => u.role === 'AM')!;
    else {
      newUser = users.find(u => u.id === 'm_jasonw') || users.find(u => u.role === 'Manager')!;
    }
    setCurrentUser(newUser);
  };

  const addTicket = (ticket: Ticket) => {
    setTickets([ticket, ...tickets]);
  };

  const updateTicketStage = (id: string, stage: TicketStage) => {
    setTickets(prev => prev.map(t => 
      t.id === id ? { ...t, stage, lastUpdated: new Date().toISOString() } : t
    ));
    knownBreaches.current.delete(id);
    setNotifications(prev => prev.filter(n => !n.includes(id)));
  };

  const toggleAMStatus = (backupId?: string) => {
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { 
          ...u, 
          isOoO: !u.isOoO,
          backupAMId: backupId || u.backupAMId 
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    setCurrentUser(updatedUsers.find(u => u.id === currentUser.id)!);
  };

  const activeBreachCount = tickets.filter(t => calculateSLAStatus(t) === 'Breach').length;

  return (
    <Layout 
      user={currentUser} 
      notificationCount={activeBreachCount}
      onLogout={() => alert('Signed Out')} 
      onRoleChange={handleRoleChange}
      onClearNotifications={() => setNotifications([])}
    >
      {currentUser.role === 'Client' && (
        <ClientPortal user={currentUser} tickets={tickets} addTicket={addTicket} />
      )}
      {currentUser.role === 'AM' && (
        <AMDashboard 
          user={currentUser} 
          tickets={tickets} 
          onUpdateTicket={updateTicketStage} 
          onToggleStatus={toggleAMStatus}
        />
      )}
      {currentUser.role === 'Manager' && (
        <ManagerDashboard currentUser={currentUser} tickets={tickets} />
      )}
    </Layout>
  );
};

export default App;
