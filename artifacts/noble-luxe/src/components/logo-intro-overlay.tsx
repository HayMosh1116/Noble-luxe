import { useEffect, useState } from 'react';

interface LogoIntroOverlayProps {
  onComplete?: () => void;
}

export function LogoIntroOverlay({ onComplete }: LogoIntroOverlayProps) {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      // Respect prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return false;
      }
      // Show only on initial storefront load per browser session
      const alreadyShown = sessionStorage.getItem('noble_luxe_intro_viewed');
      return !alreadyShown;
    } catch {
      return false;
    }
  });

  const [phase, setPhase] = useState<'entering' | 'settling' | 'exiting'>('entering');

  useEffect(() => {
    if (!isVisible) return;

    // Settle phase with subtle shimmer
    const settleTimer = window.setTimeout(() => {
      setPhase('settling');
    }, 700);

    // Start graceful fade-out transition
    const exitTimer = window.setTimeout(() => {
      setPhase('exiting');
    }, 1500);

    // Fully complete and unmount from DOM
    const finishTimer = window.setTimeout(() => {
      setIsVisible(false);
      try {
        sessionStorage.setItem('noble_luxe_intro_viewed', 'true');
      } catch {}
      onComplete?.();
    }, 2000);

    return () => {
      window.clearTimeout(settleTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(finishTimer);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const logoUrl = `${basePath}/logo.png`;

  const handleDismiss = () => {
    setPhase('exiting');
    window.setTimeout(() => {
      setIsVisible(false);
      try {
        sessionStorage.setItem('noble_luxe_intro_viewed', 'true');
      } catch {}
      onComplete?.();
    }, 300);
  };

  return (
    <div
      role="status"
      aria-label="Noble Luxe Welcome"
      onClick={handleDismiss}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-500 ease-out select-none cursor-pointer ${
        phase === 'exiting' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(circle at center, #18181b 0%, #09090b 70%, #000000 100%)',
      }}
    >
      <div className="relative flex flex-col items-center justify-center px-4">
        {/* Subtle Luxury Ambient Glow */}
        <div
          className={`absolute h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-amber-500/10 blur-3xl transition-all duration-1000 ease-out pointer-events-none ${
            phase === 'entering' ? 'scale-75 opacity-0' : phase === 'settling' ? 'scale-110 opacity-70' : 'scale-125 opacity-0'
          }`}
        />

        {/* Logo Container with Smooth Scale & Opacity */}
        <div
          className={`relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            phase === 'entering'
              ? 'opacity-0 scale-90 translate-y-1'
              : phase === 'settling'
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-105 -translate-y-1'
          }`}
        >
          <img
            src={logoUrl}
            alt="NOBLE LUXE"
            className="h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-44 object-contain rounded-2xl ring-1 ring-white/10"
            loading="eager"
            decoding="async"
          />

          {/* Luxury Shimmer Sweep */}
          <div
            className={`absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/15 to-transparent transition-transform duration-1000 ease-in-out ${
              phase === 'settling' ? 'translate-x-full' : '-translate-x-full'
            }`}
          />
        </div>

        {/* Elegant Minimalist Wordmark & Tagline */}
        <div
          className={`mt-6 text-center transition-all duration-700 delay-150 ease-out ${
            phase === 'entering'
              ? 'opacity-0 translate-y-2'
              : phase === 'settling'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-1'
          }`}
        >
          <div className="font-display tracking-[0.25em] text-xs sm:text-sm font-semibold uppercase text-zinc-100">
            NOBLE LUXE
          </div>
          <div className="mt-1 tracking-[0.2em] text-[10px] sm:text-xs text-zinc-400 font-light">
            PREMIUM COUTURE
          </div>
        </div>
      </div>
    </div>
  );
}
