
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { User, Ticket, TicketStage, UserRole } from './types';
import { USERS, INITIAL_TICKETS } from './constants';
import { ClientPortal } from './views/ClientPortal';
import { AMDashboard } from './views/AMDashboard';
import { RegionalDashboard } from './views/RegionalDashboard';
import { ExecutiveDashboard } from './views/ExecutiveDashboard';
import { calculateSLAStatus } from './services/ticketService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(USERS[0]);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [users, setUsers] = useState<User[]>(USERS);
  const [notifications, setNotifications] = useState<string[]>([]);
  
  const knownBreaches = useRef<Set<string>>(new Set());

  useEffect(() => {
    const runSLACheck = () => {
      const currentBreaches = tickets.filter(t => calculateSLAStatus(t) === 'Breach');
      currentBreaches.forEach(ticket => {
        if (!knownBreaches.current.has(ticket.id)) {
          const msg = `ALERT: Ticket ${ticket.id} SLA Breach. Escalated to Management.`;
          setNotifications(prev => [...prev, msg]);
          knownBreaches.current.add(ticket.id);
        }
      });
    };
    runSLACheck();
    const interval = setInterval(runSLACheck, 60000);
    return () => clearInterval(interval);
  }, [tickets]);

  const handleRoleChange = (role: UserRole) => {
    let newUser = users.find(u => u.role === role);
    if (!newUser) {
      if (role === 'Regional') newUser = users.find(u => u.id === 'rl_jason');
      else if (role === 'Director') newUser = users.find(u => u.role === 'Director');
      else if (role === 'National') newUser = users.find(u => u.role === 'National');
    }
    if (newUser) setCurrentUser(newUser);
  };

  const addTicket = (ticket: Ticket) => {
    setTickets([ticket, ...tickets]);
  };

  const updateTicketStage = (id: string, stage: TicketStage) => {
    setTickets(prev => prev.map(t => 
      t.id === id ? { ...t, stage, lastUpdated: new Date().toISOString() } : t
    ));
    knownBreaches.current.delete(id);
  };

  const toggleAMStatus = (backupId?: string) => {
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, isOoO: !u.isOoO, backupAMId: backupId || u.backupAMId };
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
      onLogout={() => alert('Logged Out')} 
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
      {currentUser.role === 'Regional' && (
        <RegionalDashboard currentUser={currentUser} tickets={tickets} />
      )}
      {(currentUser.role === 'National' || currentUser.role === 'Director') && (
        <ExecutiveDashboard role={currentUser.role} tickets={tickets} />
      )}
    </Layout>
  );
};

export default App;
