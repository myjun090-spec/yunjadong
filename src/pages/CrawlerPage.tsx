import { useState } from 'react';
import { Play, Pause, Plus, Globe } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { crawlerData, targetSites } from '@/data/mockData';

const CrawlerPage = () => {
  const [newUrl, setNewUrl] = useState('');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Crawler</h1>
        <p className="text-muted-foreground">웹 데이터 수집 및 모니터링</p>
      </div>

      {/* 설정 패널 */}
      <GlassCard neon className="p-6">
        <h3 className="font-semibold text-lg mb-4">크롤링 타겟 설정</h3>
        
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="수집할 URL을 입력하세요 (예: https://example.com)"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="flex-1 bg-background/50 border-border/50 focus:border-primary"
          />
          <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            추가
          </Button>
          <Button className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30">
            <Play className="w-4 h-4 mr-2" />
            수집 시작
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {targetSites.map((site) => (
            <div 
              key={site.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-background/30 border border-border/30"
            >
              <Globe className="w-4 h-4 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{site.name}</p>
                <p className="text-xs text-muted-foreground truncate">{site.url}</p>
              </div>
              <button 
                className={`p-1.5 rounded ${
                  site.status === 'active' 
                    ? 'text-emerald-400 hover:bg-emerald-500/20' 
                    : 'text-amber-400 hover:bg-amber-500/20'
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
        <div className="p-4 border-b border-border/30">
          <h3 className="font-semibold">수집된 데이터</h3>
          <p className="text-sm text-muted-foreground">총 {crawlerData.length}건의 데이터가 수집되었습니다</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-background/30">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">#</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">회사명</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">공고 제목</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">마감일</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">상태</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">출처</th>
              </tr>
            </thead>
            <tbody>
              {crawlerData.map((item, index) => (
                <tr 
                  key={item.id}
                  className="border-b border-border/20 hover:bg-background/30 transition-colors opacity-0 animate-fade-in"
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
                  <td className="p-4 text-sm text-primary">{item.source}</td>
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
