import { ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  neon?: boolean;
  hover?: boolean;
  style?: CSSProperties;
}

const GlassCard = ({ children, className, neon = false, hover = true, style }: GlassCardProps) => {
  return (
    <div 
      className={cn(
        neon ? 'glass-card-neon' : 'glass-card',
        hover && 'transition-all duration-300 hover:scale-[1.02] hover:shadow-lg',
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export default GlassCard;
