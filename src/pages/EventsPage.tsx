import { MapPin, Users, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import GlassCard from '@/components/ui/GlassCard';
import { events } from '@/data/mockData';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="apple-card p-2 text-xs">
        <p className="text-foreground font-medium">{payload[0].name}: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const EventsPage = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2 tracking-tight">Event Manager</h1>
        <p className="text-muted-foreground text-sm sm:text-base">행사 및 이벤트를 효율적으로 관리하세요</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-36 sm:h-40 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
              </div>
              
              <div className="p-4 sm:p-5">
                <h3 className="font-semibold text-base sm:text-lg text-foreground mb-3 line-clamp-1">
                  {event.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-violet-600" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm">
                      <span className="text-primary font-semibold">{event.registrants}</span>
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
                            <Cell fill="hsl(211, 100%, 45%)" />
                            <Cell fill="hsl(0, 0%, 90%)" />
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
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