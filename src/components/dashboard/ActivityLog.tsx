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
  mail: 'text-primary',
  event: 'text-secondary',
  crawler: 'text-emerald-400',
  alert: 'text-amber-400',
  system: 'text-muted-foreground',
};

const ActivityLog = () => {
  return (
    <GlassCard neon className="p-6">
      <h3 className="text-lg font-semibold mb-4 gradient-text">최근 활동 로그</h3>
      <div className="space-y-4">
        {activityLogs.map((log, index) => {
          const Icon = iconMap[log.icon];
          return (
            <div 
              key={log.id}
              className="flex items-start gap-4 p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors opacity-0 animate-slide-in-left"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`p-2 rounded-lg bg-muted/50 ${typeColors[log.type]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{log.message}</p>
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
