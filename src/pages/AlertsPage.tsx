import { ExternalLink } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { newsAlerts } from '@/data/mockData';

const AlertsPage = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2 tracking-tight">Alerts</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Google Alerts로 수집된 최신 뉴스를 확인하세요</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {newsAlerts.map((news, index) => (
          <GlassCard 
            key={news.id} 
            neon 
            className="overflow-hidden opacity-0 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative h-40 sm:h-44 overflow-hidden">
              <img 
                src={news.image} 
                alt={news.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full shadow-soft">
                  {news.source}
                </span>
              </div>
            </div>
            
            <div className="p-4 sm:p-5">
              <p className="text-xs text-muted-foreground mb-2 font-medium">{news.date}</p>
              <h3 className="font-semibold text-foreground mb-3 line-clamp-2 leading-snug">
                {news.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {news.summary}
              </p>
              
              <a 
                href={news.url}
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors group font-medium"
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