import { MapPin, Users, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import GlassCard from '@/components/ui/GlassCard';
import { events } from '@/data/mockData';

const EventsPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Event Manager</h1>
        <p className="text-muted-foreground">행사 및 이벤트를 효율적으로 관리하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => {
          const pieData = [
            { name: '출석', value: event.attendanceRate },
            { name: '미출석', value: 100 - event.attendanceRate },
          ];
          
          return (
            <GlassCard 
              key={event.id} 
              neon 
              className="overflow-hidden cursor-pointer opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` } as any}
            >
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
              </div>
              
              <div className="p-5">
                <h3 className="font-semibold text-lg text-foreground mb-3 line-clamp-1">
                  {event.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm">
                      <span className="neon-text-cyan font-semibold">{event.registrants}</span>
                      <span className="text-muted-foreground">/{event.capacity}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            innerRadius={15}
                            outerRadius={22}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            <Cell fill="hsl(187, 100%, 50%)" />
                            <Cell fill="hsl(217, 32%, 17%)" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {event.attendanceRate}%
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

export default EventsPage;
