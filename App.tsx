import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Store, Settings, Menu, FileText, Briefcase, LogOut } from 'lucide-react';
import { CashierView } from './components/CashierView';
import { ReportsView } from './components/ReportsView';
import { ServicesView } from './components/ServicesView';
import { DashboardView } from './components/DashboardView';
import { SettingsView } from './components/SettingsView';
import { Transaction, Expense, Service, User } from './types';

enum Tab {
  DASHBOARD = 'Dashboard',
  CAJA = 'Caja',
  SERVICIOS = 'Servicios',
  INFORMES = 'Informes',
  SETTINGS = 'Configuración'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedUserForLogin, setSelectedUserForLogin] = useState<User | null>(null);
  
  // State lifted
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Fetch Data from API
  const fetchData = async () => {
    try {
      const [tRes, eRes, sRes, uRes] = await Promise.all([
        fetch('/api/transactions'),
        fetch('/api/expenses'),
        fetch('/api/services'),
        fetch('/api/users')
      ]);
      
      const [tData, eData, sData, uData] = await Promise.all([
        tRes.json(),
        eRes.json(),
        sRes.json(),
        uRes.json()
      ]);

      setTransactions(tData);
      setExpenses(eData);
      setServices(sData);
      setUsers(uData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Apply theme
  useEffect(() => {
    if (currentUser?.theme) {
      document.documentElement.className = currentUser.theme;
    } else {
      document.documentElement.className = 'light';
    }
  }, [currentUser?.theme]);

  // Redirect to Caja on login
  useEffect(() => {
    if (currentUser && activeTab === Tab.DASHBOARD) {
      setActiveTab(Tab.CAJA);
    }
  }, [currentUser]);

  // API Wrappers for state updates
  const handleAddTransaction = async (t: Transaction) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t)
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  const handleUpdateTransaction = async (t: Transaction) => {
    try {
      const res = await fetch(`/api/transactions/${t.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t)
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Error updating transaction:', err);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  const handleAddExpense = async (e: Expense) => {
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(e)
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  const handleUpdateExpense = async (e: Expense) => {
    try {
      const res = await fetch(`/api/expenses/${e.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(e)
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Error updating expense:', err);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  const handleAddService = async (s: Service) => {
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(s)
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Error adding service:', err);
    }
  };

  const handleUpdateService = async (s: Service) => {
    try {
      const res = await fetch(`/api/services/${s.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(s)
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Error updating service:', err);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Error deleting service:', err);
    }
  };

  const handleUpdateUser = async (u: User) => {
    try {
      const res = await fetch(`/api/users/${u.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(u)
      });
      if (res.ok) {
        fetchData();
        if (currentUser?.id === u.id) {
          setCurrentUser(u);
        }
      }
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleRegister = async (name: string, username: string, pass: string, phone: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password: pass, phone })
      });
      if (res.ok) {
        fetchData();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
        if (currentUser?.id === id) {
          setCurrentUser(null);
          setActiveTab(Tab.DASHBOARD);
        }
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DASHBOARD:
        return (
          <DashboardView 
            users={users} 
            onLogin={setCurrentUser} 
            currentUser={currentUser} 
            onRegister={handleRegister} 
            selectedUserForLogin={selectedUserForLogin}
            onDeleteUser={handleDeleteUser}
            onUpdateUser={handleUpdateUser}
          />
        );
      case Tab.CAJA:
        return (
          <CashierView 
            transactions={transactions} 
            setTransactions={setTransactions as any}
            expenses={expenses}
            setExpenses={setExpenses as any}
            services={services}
            onAddTransaction={handleAddTransaction}
            onUpdateTransaction={handleUpdateTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
            currentUser={currentUser}
          />
        );
      case Tab.SERVICIOS:
        return (
          <ServicesView 
            services={services} 
            setServices={setServices as any}
            onAddService={handleAddService}
            onUpdateService={handleUpdateService}
            onDeleteService={handleDeleteService}
            currentUser={currentUser}
          />
        );
      case Tab.INFORMES:
        return <ReportsView transactions={transactions} expenses={expenses} currentUser={currentUser} />;
      case Tab.SETTINGS:
        return <SettingsView currentUser={currentUser} onUpdateUser={handleUpdateUser} users={users} onDeleteUser={handleDeleteUser} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900">
      {/* Sidebar - Hidden when printing */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 text-white transition-all duration-300 flex flex-col shadow-xl z-10 print:hidden`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-white">Gestión en caja</span>}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {!currentUser && (
            <SidebarItem 
              icon={<LayoutDashboard size={22} />} 
              label="Dashboard" 
              isActive={activeTab === Tab.DASHBOARD}
              isOpen={isSidebarOpen}
              onClick={() => setActiveTab(Tab.DASHBOARD)}
            />
          )}

          {!currentUser && users.length > 0 && (
            <div className="pt-4 pb-2">
              {isSidebarOpen && (
                <div className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Usuarios
                </div>
              )}
              <div className="space-y-1">
                {users.map(user => (
                  <div 
                    key={user.id} 
                    className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedUserForLogin(user);
                      setActiveTab(Tab.DASHBOARD);
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                      {user.avatarType === 'image' && user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        user.avatar || user.name.charAt(0)
                      )}
                    </div>
                    {isSidebarOpen && (
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium truncate">{user.name}</span>
                        <span className="text-xs text-slate-500 truncate">@{user.username}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentUser && (
            <>
              <SidebarItem 
                icon={<Store size={22} />} 
                label="Caja" 
                isActive={activeTab === Tab.CAJA}
                isOpen={isSidebarOpen}
                onClick={() => setActiveTab(Tab.CAJA)}
              />
              <SidebarItem 
                icon={<Briefcase size={22} />} 
                label="Servicios" 
                isActive={activeTab === Tab.SERVICIOS}
                isOpen={isSidebarOpen}
                onClick={() => setActiveTab(Tab.SERVICIOS)}
              />
              <SidebarItem 
                icon={<FileText size={22} />} 
                label="Informes" 
                isActive={activeTab === Tab.INFORMES}
                isOpen={isSidebarOpen}
                onClick={() => setActiveTab(Tab.INFORMES)}
              />
              <SidebarItem 
                icon={<Settings size={22} />} 
                label="Configuración" 
                isActive={activeTab === Tab.SETTINGS}
                isOpen={isSidebarOpen}
                onClick={() => setActiveTab(Tab.SETTINGS)}
              />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold overflow-hidden">
              {currentUser ? (
                currentUser.avatarType === 'image' && currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  currentUser.avatar || currentUser.name.charAt(0)
                )
              ) : '?'}
            </div>
            {isSidebarOpen && (
              <div className="flex flex-1 items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{currentUser ? currentUser.name : 'Invitado'}</span>
                  <span className="text-xs text-slate-400">{currentUser ? 'Online' : 'Desconectado'}</span>
                </div>
                {currentUser && (
                  <button 
                    onClick={() => {
                      setCurrentUser(null);
                      setActiveTab(Tab.DASHBOARD);
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                    title="Cerrar Sesión"
                  >
                    <LogOut size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden bg-slate-50 relative print:bg-white print:overflow-visible">
        {renderContent()}
      </main>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isOpen: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, isOpen, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <div className={`${isActive ? 'text-white' : ''}`}>{icon}</div>
    {isOpen && <span className="font-medium whitespace-nowrap">{label}</span>}
  </button>
);

export default App;