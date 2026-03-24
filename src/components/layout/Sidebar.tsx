import { useState } from 'react';
import {
  LayoutDashboard,
  Mail,
  Calendar,
  Bell,
  Globe,
  ChevronLeft,
  ChevronRight,
  Zap,
  Menu,
  X,
  Package,
  PenTool,
  MessageCircle,
  Building2,
  FileText,
  FileCheck,
  UserPlus,
  Users,
  Search
} from 'lucide-react';

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inventory', label: '엑셀 재고관리', icon: Package },
  { id: 'blog', label: '블로그 글쓰기', icon: PenTool },
  { id: 'kakao', label: '카톡 자동화', icon: MessageCircle },
  { id: 'realestate', label: '부동산 수집', icon: Building2 },
  { id: 'invoice', label: '명세서 자동화', icon: FileText },
  { id: 'registry', label: '등기부등본 발급', icon: FileCheck },
  { id: 'neighbor', label: '서로이웃 추가', icon: UserPlus },
  { id: 'workforce', label: '인력배치', icon: Users },
  { id: 'keyword', label: '황금 키워드', icon: Search },
  { id: 'mail', label: 'Mail & SMS', icon: Mail },
  { id: 'events', label: 'Event Manager', icon: Calendar },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'crawler', label: 'Crawler', icon: Globe },
];

const Sidebar = ({ activeMenu, onMenuChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleMenuClick = (id: string) => {
    onMenuChange(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2.5 rounded-xl bg-card shadow-soft border border-border"
      >
        {isMobileOpen ? (
          <X className="w-5 h-5 text-foreground" />
        ) : (
          <Menu className="w-5 h-5 text-foreground" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-soft">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg text-foreground tracking-tight">OA System</span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mx-auto shadow-soft">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <ul className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                      isActive 
                        ? 'bg-primary text-primary-foreground shadow-soft' 
                        : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0`} />
                    {!isCollapsed && (
                      <span className="font-medium tracking-tight">
                        {item.label}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse Button - Desktop only */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border items-center justify-center hover:bg-accent transition-colors shadow-sm"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {/* Footer */}
        <div className="absolute bottom-4 left-0 right-0 px-3">
          <div className={`apple-card p-3 ${isCollapsed ? 'text-center' : ''}`}>
            <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              {!isCollapsed && (
                <span className="text-xs text-muted-foreground">시스템 정상 운영중</span>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;