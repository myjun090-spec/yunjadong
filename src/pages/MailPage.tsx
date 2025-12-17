import { Plus } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { mailHistory } from '@/data/mockData';

const statusBadges: { [key: string]: string } = {
  success: 'status-success',
  pending: 'status-pending',
  failed: 'status-failed',
};

const statusLabels: { [key: string]: string } = {
  success: '성공',
  pending: '대기중',
  failed: '실패',
};

const MailPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Mail & SMS</h1>
          <p className="text-muted-foreground">메일 및 문자 캠페인을 관리하세요</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 neon-glow-cyan">
          <Plus className="w-4 h-4 mr-2" />
          새 캠페인 만들기
        </Button>
      </div>

      <GlassCard neon className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">날짜</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">제목</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">수신자 수</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">상태</th>
              </tr>
            </thead>
            <tbody>
              {mailHistory.map((mail, index) => (
                <tr 
                  key={mail.id} 
                  className="border-b border-border/30 hover:bg-background/30 transition-colors opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="p-4 text-sm text-muted-foreground">{mail.date}</td>
                  <td className="p-4 text-sm text-foreground font-medium">{mail.title}</td>
                  <td className="p-4 text-sm">
                    <span className="neon-text-cyan">{mail.recipients.toLocaleString()}</span>
                  </td>
                  <td className="p-4">
                    <span className={statusBadges[mail.status]}>
                      {statusLabels[mail.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default MailPage;
