import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ArrowLeft, AlertCircle, ShieldAlert, KeyRound } from 'lucide-react';
import { GlassCard, PremiumButton, GlassInput } from './DesignSystem';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function AdminLogin({ onSuccess, onCancel }: AdminLoginProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(false);

    // Simulate luxury processing/checking delay
    setTimeout(() => {
      if (pin === '102030') {
        onSuccess();
      } else {
        setError(true);
        setPin('');
        setIsSubmitting(false);
      }
    }, 600);
  };

  const handleKeypadPress = (num: string) => {
    setError(false);
    if (pin.length < 6) {
      setPin((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    setError(false);
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setError(false);
    setPin('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-[#1a140a]/20 pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md mx-auto"
      >
        <GlassCard className="p-8 border border-[#DFBA6B]/20 relative overflow-hidden">
          {/* Subtle gold decorative gradient background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#DFBA6B]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#AA7C11]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Heading Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-[#DFBA6B]/15 to-[#AA7C11]/15 border border-[#DFBA6B]/30 flex items-center justify-center text-[#DFBA6B] mb-4 shadow-[0_0_20px_rgba(223,186,107,0.1)]"
            >
              <Lock className="w-6 h-6 animate-pulse" />
            </motion.div>

            <h2 className="font-serif text-xl tracking-[0.15em] uppercase font-bold text-white mb-2">
              Acesso Restrito
            </h2>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#DFBA6B] font-semibold mb-3">
              Painel de Administração
            </p>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-[280px]">
              Insira sua senha de credencial para gerenciar produtos, pedidos e configurações.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="relative">
              <GlassInput
                type="password"
                label="Senha de Acesso *"
                placeholder="••••••"
                value={pin}
                onChange={(e) => {
                  setError(false);
                  setPin(e.target.value);
                }}
                maxLength={12}
                disabled={isSubmitting}
                autoFocus
                className={`text-center text-lg tracking-[0.5em] font-mono focus:border-[#DFBA6B] ${
                  error ? 'border-red-500/50 focus:border-red-500' : ''
                }`}
                icon={<KeyRound className="w-5 h-5 text-[#DFBA6B]/70" />}
              />

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute -bottom-6 left-0 right-0 flex items-center justify-center gap-1.5 text-red-400 text-[10px] uppercase tracking-wider font-semibold pl-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Senha incorreta. Tente novamente.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Digital Password Keyboard Pad */}
            <div className="grid grid-cols-3 gap-2.5 mt-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num)}
                  disabled={isSubmitting}
                  className="h-12 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] active:bg-[#DFBA6B]/15 border border-white/5 active:border-[#DFBA6B]/40 text-sm font-sans font-medium text-white transition-all duration-150 cursor-pointer select-none active:scale-95"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                disabled={isSubmitting}
                className="h-12 rounded-lg bg-red-950/10 hover:bg-red-950/20 active:bg-red-500/10 border border-red-500/5 text-[10px] uppercase tracking-widest font-semibold text-red-400 transition-all cursor-pointer select-none"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                disabled={isSubmitting}
                className="h-12 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] active:bg-[#DFBA6B]/15 border border-white/5 active:border-[#DFBA6B]/40 text-sm font-sans font-medium text-white transition-all duration-150 cursor-pointer select-none active:scale-95"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                disabled={isSubmitting}
                className="h-12 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] active:bg-white/10 border border-white/5 text-xs font-sans font-semibold text-zinc-300 transition-all cursor-pointer select-none active:scale-95"
              >
                ⌫
              </button>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <PremiumButton
                type="submit"
                variant="solid"
                fullWidth
                disabled={!pin || isSubmitting}
                className="py-4 text-xs tracking-[0.2em] font-bold"
              >
                <span>{isSubmitting ? 'Verificando...' : 'Autenticar Acesso'}</span>
              </PremiumButton>

              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-1.5 py-2 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors cursor-pointer select-none"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar para a Loja</span>
                </button>
              )}
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
