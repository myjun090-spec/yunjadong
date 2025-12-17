import { useState } from 'react';
import { 
  LayoutDashboard, 
  Mail, 
  Calendar, 
  Bell, 
  Globe, 
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'mail', label: 'Mail & SMS', icon: Mail },
  { id: 'events', label: 'Event Manager', icon: Calendar },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'crawler', label: 'Crawler', icon: Globe },
];

const Sidebar = ({ activeMenu, onMenuChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center animate-glow">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg gradient-text">OA System</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center mx-auto animate-glow">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onMenuChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground neon-glow-cyan' 
                      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                  }`}
                >
                  <Icon 
                    className={`w-5 h-5 flex-shrink-0 transition-colors ${
                      isActive ? 'text-primary' : 'group-hover:text-primary'
                    }`} 
                  />
                  {!isCollapsed && (
                    <span className={`font-medium ${isActive ? 'neon-text-cyan' : ''}`}>
                      {item.label}
                    </span>
                  )}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-neon" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-accent transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <div className={`glass-card p-3 ${isCollapsed ? 'text-center' : ''}`}>
          <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {!isCollapsed && (
              <span className="text-xs text-muted-foreground">시스템 정상 운영중</span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
