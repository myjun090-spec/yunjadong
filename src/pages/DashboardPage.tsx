import { Mail, Calendar, Newspaper, Activity } from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import ActivityLog from '@/components/dashboard/ActivityLog';
import { kpiData } from '@/data/mockData';

const DashboardPage = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2 tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">사무 자동화 시스템 현황을 한눈에 확인하세요</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KPICard
          title="오늘 보낸 메일"
          value={kpiData.mailsSent}
          icon={Mail}
          color="blue"
          delay={0}
        />
        <KPICard
          title="다가오는 행사"
          value={kpiData.upcomingEvents}
          icon={Calendar}
          color="purple"
          delay={100}
        />
        <KPICard
          title="수집된 뉴스"
          value={kpiData.collectedNews}
          icon={Newspaper}
          color="amber"
          delay={200}
        />
        <KPICard
          title="시스템 상태"
          value={kpiData.systemStatus}
          suffix="%"
          icon={Activity}
          color="emerald"
          delay={300}
        />
      </div>

      {/* Activity Log */}
      <ActivityLog />
    </div>
  );
};

export default DashboardPage;