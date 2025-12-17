import { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

interface KPICardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  color: 'cyan' | 'magenta' | 'purple' | 'emerald';
  delay?: number;
}

const colorClasses = {
  cyan: 'neon-text-cyan',
  magenta: 'neon-text-magenta',
  purple: 'text-neon-purple',
  emerald: 'text-emerald-400',
};

const glowClasses = {
  cyan: 'neon-glow-cyan',
  magenta: 'neon-glow-magenta',
  purple: 'neon-glow-purple',
  emerald: 'shadow-[0_0_20px_rgba(52,211,153,0.3)]',
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
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <p className={`text-4xl font-bold ${colorClasses[color]}`}>
            {displayValue.toLocaleString()}{suffix}
          </p>
        </div>
        <div className={`p-3 rounded-xl bg-background/50 ${glowClasses[color]}`}>
          <Icon className={`w-6 h-6 ${colorClasses[color]}`} />
        </div>
      </div>
    </GlassCard>
  );
};

export default KPICard;
