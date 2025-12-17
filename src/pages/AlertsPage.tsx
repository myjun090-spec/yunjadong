import { ExternalLink } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { newsAlerts } from '@/data/mockData';

const AlertsPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Alerts</h1>
        <p className="text-muted-foreground">Google Alerts로 수집된 최신 뉴스를 확인하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsAlerts.map((news, index) => (
          <GlassCard 
            key={news.id} 
            neon 
            className="overflow-hidden opacity-0 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` } as any}
          >
            <div className="relative h-44 overflow-hidden">
              <img 
                src={news.image} 
                alt={news.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 text-xs font-medium bg-primary/90 text-primary-foreground rounded">
                  {news.source}
                </span>
              </div>
            </div>
            
            <div className="p-5">
              <p className="text-xs text-muted-foreground mb-2">{news.date}</p>
              <h3 className="font-semibold text-foreground mb-3 line-clamp-2 leading-snug">
                {news.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {news.summary}
              </p>
              
              <a 
                href={news.url}
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors group"
              >
                <span>원문 보기</span>
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default AlertsPage;
