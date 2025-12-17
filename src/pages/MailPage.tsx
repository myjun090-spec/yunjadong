import { Plus, Download } from 'lucide-react';
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

const downloadCSV = () => {
  const headers = ['날짜', '제목', '수신자 수', '상태'];
  const rows = mailHistory.map(mail => [
    mail.date,
    mail.title,
    mail.recipients.toString(),
    statusLabels[mail.status]
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');
  
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'mail_history.csv';
  link.click();
};

const MailPage = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2 tracking-tight">Mail & SMS</h1>
          <p className="text-muted-foreground text-sm sm:text-base">메일 및 문자 캠페인을 관리하세요</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={downloadCSV}
            className="border-border hover:bg-muted"
          >
            <Download className="w-4 h-4 mr-2" />
            CSV 다운로드
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft">
            <Plus className="w-4 h-4 mr-2" />
            새 캠페인 만들기
          </Button>
        </div>
      </div>

      <GlassCard neon className="overflow-hidden">
        {/* Mobile Card View */}
        <div className="sm:hidden divide-y divide-border">
          {mailHistory.map((mail, index) => (
            <div 
              key={mail.id} 
              className="p-4 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-muted-foreground">{mail.date}</span>
                <span className={statusBadges[mail.status]}>
                  {statusLabels[mail.status]}
                </span>
              </div>
              <h3 className="font-medium text-foreground mb-2">{mail.title}</h3>
              <p className="text-sm text-muted-foreground">
                수신자: <span className="text-primary font-semibold">{mail.recipients.toLocaleString()}</span>명
              </p>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">날짜</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">제목</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">수신자 수</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">상태</th>
              </tr>
            </thead>
            <tbody>
              {mailHistory.map((mail, index) => (
                <tr 
                  key={mail.id} 
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="p-4 text-sm text-muted-foreground">{mail.date}</td>
                  <td className="p-4 text-sm text-foreground font-medium">{mail.title}</td>
                  <td className="p-4 text-sm">
                    <span className="text-primary font-semibold">{mail.recipients.toLocaleString()}</span>
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