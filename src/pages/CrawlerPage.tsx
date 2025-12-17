import { useState } from 'react';
import { Play, Pause, Plus, Globe, Download } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { crawlerData, targetSites } from '@/data/mockData';

const downloadCSV = () => {
  const headers = ['#', '회사명', '공고 제목', '마감일', '상태', '출처'];
  const rows = crawlerData.map(item => [
    item.id.toString(),
    item.company,
    item.announcement,
    item.deadline,
    item.status === 'active' ? '모집중' : '마감',
    item.source
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'crawler_data.csv';
  link.click();
};

const CrawlerPage = () => {
  const [newUrl, setNewUrl] = useState('');

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2 tracking-tight">Crawler</h1>
        <p className="text-muted-foreground text-sm sm:text-base">웹 데이터 수집 및 모니터링</p>
      </div>

      {/* 설정 패널 */}
      <GlassCard neon className="p-4 sm:p-6">
        <h3 className="font-semibold text-lg mb-4">크롤링 타겟 설정</h3>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <Input
            placeholder="수집할 URL을 입력하세요"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="flex-1 bg-muted/50 border-border focus:border-primary rounded-xl"
          />
          <div className="flex gap-3">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft rounded-xl flex-1 sm:flex-none">
              <Plus className="w-4 h-4 mr-2" />
              추가
            </Button>
            <Button className="bg-emerald-500 text-white hover:bg-emerald-600 shadow-soft rounded-xl flex-1 sm:flex-none">
              <Play className="w-4 h-4 mr-2" />
              수집 시작
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {targetSites.map((site) => (
            <div 
              key={site.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50"
            >
              <Globe className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{site.name}</p>
                <p className="text-xs text-muted-foreground truncate">{site.url}</p>
              </div>
              <button 
                className={`p-1.5 rounded-lg transition-colors ${
                  site.status === 'active' 
                    ? 'text-emerald-600 hover:bg-emerald-100' 
                    : 'text-amber-600 hover:bg-amber-100'
                }`}
              >
                {site.status === 'active' ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* 데이터 그리드 */}
      <GlassCard neon className="overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">수집된 데이터</h3>
            <p className="text-sm text-muted-foreground">총 {crawlerData.length}건의 데이터가 수집되었습니다</p>
          </div>
          <Button 
            variant="outline" 
            onClick={downloadCSV}
            className="border-border hover:bg-muted rounded-xl"
          >
            <Download className="w-4 h-4 mr-2" />
            CSV 다운로드
          </Button>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden divide-y divide-border">
          {crawlerData.map((item, index) => (
            <div 
              key={item.id}
              className="p-4 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-muted-foreground">#{item.id}</span>
                <span className={item.status === 'active' ? 'status-success' : 'status-pending'}>
                  {item.status === 'active' ? '모집중' : '마감'}
                </span>
              </div>
              <h3 className="font-medium text-foreground mb-1">{item.company}</h3>
              <p className="text-sm text-muted-foreground mb-2">{item.announcement}</p>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>마감: {item.deadline}</span>
                <span className="text-primary">{item.source}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">#</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">회사명</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">공고 제목</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">마감일</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">상태</th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">출처</th>
              </tr>
            </thead>
            <tbody>
              {crawlerData.map((item, index) => (
                <tr 
                  key={item.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="p-4 text-sm text-muted-foreground">{item.id}</td>
                  <td className="p-4 text-sm font-medium text-foreground">{item.company}</td>
                  <td className="p-4 text-sm text-foreground">{item.announcement}</td>
                  <td className="p-4 text-sm text-muted-foreground">{item.deadline}</td>
                  <td className="p-4">
                    <span className={item.status === 'active' ? 'status-success' : 'status-pending'}>
                      {item.status === 'active' ? '모집중' : '마감'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-primary font-medium">{item.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default CrawlerPage;