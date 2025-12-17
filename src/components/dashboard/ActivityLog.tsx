import { Mail, Calendar, Globe, Bell, Shield, MessageSquare, Users } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { activityLogs } from '@/data/mockData';

const iconMap: { [key: string]: any } = {
  Mail,
  Calendar,
  Globe,
  Bell,
  Shield,
  MessageSquare,
  Users,
};

const typeColors: { [key: string]: string } = {
  mail: 'text-primary bg-primary/10',
  event: 'text-violet-600 bg-violet-100',
  crawler: 'text-emerald-600 bg-emerald-100',
  alert: 'text-amber-600 bg-amber-100',
  system: 'text-muted-foreground bg-muted',
};

const ActivityLog = () => {
  return (
    <GlassCard neon className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4 gradient-text">최근 활동 로그</h3>
      <div className="space-y-3">
        {activityLogs.map((log, index) => {
          const Icon = iconMap[log.icon];
          return (
            <div 
              key={log.id}
              className="flex items-start gap-3 sm:gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors opacity-0 animate-slide-in-left"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`p-2 rounded-xl ${typeColors[log.type]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground line-clamp-2 sm:truncate">{log.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{log.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default ActivityLog;