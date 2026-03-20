import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Coffee, Users, BarChart3, Scissors, Settings, ChevronLeft, Menu } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Agenda', icon: Calendar },
  { path: '/pdv', label: 'Cafeteria', icon: Coffee },
  { path: '/professionals', label: 'Equipe', icon: Users },
  { path: '/services', label: 'Serviços', icon: Scissors },
  { path: '/financial', label: 'Financeiro', icon: BarChart3 },
  { path: '/settings', label: 'Configurações', icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ${
          collapsed ? 'w-[68px]' : 'w-60'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center shrink-0">
            <Scissors className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-sm tracking-wide text-sidebar-foreground">
              Beleza<span className="gold-text">Studio</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 ${
                  active
                    ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center py-4 border-t border-sidebar-border text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-sidebar text-sidebar-foreground border-b border-sidebar-border flex items-center px-4 z-50">
        <div className="w-7 h-7 rounded-lg gold-gradient flex items-center justify-center mr-3">
          <Scissors className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-semibold text-sm">Beleza<span className="gold-text">Studio</span></span>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around py-2 z-50">
        {navItems.slice(0, 5).map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-14 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
