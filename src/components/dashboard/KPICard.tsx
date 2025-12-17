import { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

interface KPICardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  color: 'blue' | 'purple' | 'emerald' | 'amber';
  delay?: number;
}

const colorClasses = {
  blue: 'text-primary',
  purple: 'text-violet-600',
  emerald: 'text-emerald-600',
  amber: 'text-amber-600',
};

const bgClasses = {
  blue: 'bg-primary/10',
  purple: 'bg-violet-100',
  emerald: 'bg-emerald-100',
  amber: 'bg-amber-100',
};

const KPICard = ({ title, value, suffix = '', icon: Icon, color, delay = 0 }: KPICardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, isVisible]);

  return (
    <GlassCard 
      neon 
      className={`p-6 opacity-0 ${isVisible ? 'animate-fade-in' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-2 font-medium">{title}</p>
          <p className={`text-4xl font-bold tracking-tight ${colorClasses[color]}`}>
            {displayValue.toLocaleString()}{suffix}
          </p>
        </div>
        <div className={`p-3 rounded-2xl ${bgClasses[color]}`}>
          <Icon className={`w-6 h-6 ${colorClasses[color]}`} />
        </div>
      </div>
    </GlassCard>
  );
};

export default KPICard;