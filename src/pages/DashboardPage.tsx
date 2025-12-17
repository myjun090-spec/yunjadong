import { Mail, Calendar, Newspaper, Activity } from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import ActivityLog from '@/components/dashboard/ActivityLog';
import { kpiData } from '@/data/mockData';

const DashboardPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Dashboard</h1>
        <p className="text-muted-foreground">사무 자동화 시스템 현황을 한눈에 확인하세요</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="오늘 보낸 메일"
          value={kpiData.mailsSent}
          icon={Mail}
          color="cyan"
          delay={0}
        />
        <KPICard
          title="다가오는 행사"
          value={kpiData.upcomingEvents}
          icon={Calendar}
          color="magenta"
          delay={100}
        />
        <KPICard
          title="수집된 뉴스"
          value={kpiData.collectedNews}
          icon={Newspaper}
          color="purple"
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
