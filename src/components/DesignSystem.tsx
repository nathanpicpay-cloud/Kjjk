import React from 'react';
import { motion } from 'motion/react';

// 1. Glass Card - Matte black transparent card with beautiful blur and fine golden border
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  key?: React.Key;
}

export const GlassCard = ({ children, className = '', onClick, hoverEffect = false }: GlassCardProps) => {
  const CardComponent = motion.div;
  
  return (
    <CardComponent
      onClick={onClick}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      className={`
        relative overflow-hidden rounded-xl bg-white/[0.03] border border-white/8
        backdrop-blur-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] text-left w-full
        ${onClick ? 'cursor-pointer' : ''}
        ${hoverEffect ? 'hover:border-[#D4AF37]/40 hover:bg-white/[0.05] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(212,175,55,0.05)]' : ''}
        ${className}
      `}
    >
      {/* Premium ambient glow background effect inside the card */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative z-10 w-full h-full">{children}</div>
    </CardComponent>
  );
};

// 2. Premium Button - Interactive luxury actions with micro-scaling, gold gradient, and elegant hover
interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  variant?: 'solid' | 'outline' | 'text' | 'danger';
  type?: 'button' | 'submit';
  disabled?: boolean;
  fullWidth?: boolean;
}

export const PremiumButton = ({
  children,
  onClick,
  className = '',
  variant = 'solid',
  type = 'button',
  disabled = false,
  fullWidth = false,
}: PremiumButtonProps) => {
  // Styles for each premium variant
  const baseStyles = 'relative flex items-center justify-center gap-2 px-6 py-3.5 rounded-sm font-medium tracking-widest text-xs uppercase transition-all duration-300 overflow-hidden select-none outline-none';
  const widthStyle = fullWidth ? 'w-full' : 'w-auto';
  
  const variants = {
    solid: 'gold-gradient text-black font-bold shadow-[0_10px_30px_rgba(179,135,40,0.15)] hover:shadow-[0_12px_35px_rgba(179,135,40,0.25)] hover:opacity-95',
    outline: 'border border-[#D4AF37]/40 text-[#F5E6AD] bg-transparent hover:bg-white/5 hover:border-[#D4AF37]',
    text: 'text-[#D4AF37] hover:text-white bg-transparent border-none',
    danger: 'bg-red-950/20 border border-red-500/20 text-red-400 hover:bg-red-950/40'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.01 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className={`
        ${baseStyles} 
        ${widthStyle} 
        ${variants[variant]} 
        ${disabled ? 'opacity-40 cursor-not-allowed filter grayscale' : ''} 
        ${className}
      `}
    >
      {/* Shine overlay for metallic/solid effect */}
      {variant === 'solid' && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
};

// 3. Glass Input - Clean minimalist inputs with golden focus states
interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, icon, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-xs font-medium text-white/70 uppercase tracking-widest pl-1">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {icon && (
            <div className="absolute left-4 text-[#D4AF37]/70 z-10">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-white/[0.02] border border-white/8 rounded-xl px-4 py-3.5 text-sm text-white
              placeholder-white/30 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30
              transition-all duration-300 backdrop-blur-md font-sans
              ${icon ? 'pl-11' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';

// 4. Premium Badge - Pill label for best sellers/new releases
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'new' | 'discount' | 'neutral';
}

export const Badge = ({ children, variant = 'gold' }: BadgeProps) => {
  const styles = {
    gold: 'bg-gradient-to-r from-[#DFBA6B]/10 to-[#AA7C11]/10 border border-[#DFBA6B]/30 text-[#DFBA6B]',
    new: 'bg-emerald-950/20 border border-emerald-500/20 text-emerald-400',
    discount: 'bg-red-950/20 border border-red-500/20 text-red-400',
    neutral: 'bg-white/[0.03] border border-white/10 text-zinc-300'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase ${styles[variant]} whitespace-nowrap select-none`}>
      {children}
    </span>
  );
};

// 5. Skeleton Loading Shimmer
export const Shimmer = ({ className = '', height = 'h-4', width = 'w-full' }: { className?: string, height?: string, width?: string }) => {
  return (
    <div className={`relative overflow-hidden rounded bg-zinc-900/50 border border-zinc-800/40 ${height} ${width} ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
  );
};

// Extra keyframe style for shimmers injected directly if not in CSS
export const GlobalKeyframes = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @keyframes shimmer {
      100% {
        transform: translateX(100%);
      }
    }
  `}} />
);
