import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import DashboardPage from './DashboardPage';
import MailPage from './MailPage';
import EventsPage from './EventsPage';
import AlertsPage from './AlertsPage';
import CrawlerPage from './CrawlerPage';

const Index = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const renderPage = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardPage />;
      case 'mail':
        return <MailPage />;
      case 'events':
        return <EventsPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'crawler':
        return <CrawlerPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen">
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
      
      <main className="ml-64 min-h-screen p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default Index;
