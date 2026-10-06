import { useEffect, useState, useRef, useCallback } from 'react';

interface LogoIntroOverlayProps {
  onComplete?: () => void;
}

// In-memory flag across client-side SPA route transitions.
// Resets to false when the site is refreshed or opened in a new tab/window.
let introShownThisLifecycle = false;

// 3 minutes of inactivity / tab being in background
const INACTIVITY_TIMEOUT_MS = 3 * 60 * 1000;
const STORAGE_LAST_ACTIVE_KEY = 'noble_luxe_last_active_time';

export function LogoIntroOverlay({ onComplete }: LogoIntroOverlayProps) {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return false;
      }

      // If page was freshly loaded or refreshed, always show
      if (!introShownThisLifecycle) {
        return true;
      }

      // If user was away/inactive for longer than the timeout, show again
      const lastActive = parseInt(localStorage.getItem(STORAGE_LAST_ACTIVE_KEY) || '0', 10);
      if (lastActive && Date.now() - lastActive > INACTIVITY_TIMEOUT_MS) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  });

  // Phases across the 10-second luxury choreography:
  // 1. 'entering': 0.0s - 2.0s: gentle emergence from noir black, subtle scaling up from 0.86 -> 1.0
  // 2. 'shimmer':  2.0s - 4.5s: luxury golden specular reflection sweeps across the emblem + warm halo
  // 3. 'brand':    4.5s - 7.2s: haute couture typography reveal, tracking expansion, hairline gold rule
  // 4. 'radiance': 7.2s - 8.8s: harmonic crest breathing, subtle slow drift, peak elegance
  // 5. 'exiting':  8.8s - 10.0s: graceful cinematic dissolve/melt into storefront
  const [phase, setPhase] = useState<'entering' | 'shimmer' | 'brand' | 'radiance' | 'exiting'>('entering');
  const [progress, setProgress] = useState<number>(0);
  const timersRef = useRef<number[]>([]);

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  };

  const markCompleted = useCallback(() => {
    introShownThisLifecycle = true;
    try {
      localStorage.setItem(STORAGE_LAST_ACTIVE_KEY, Date.now().toString());
    } catch {}
  }, []);

  const handleDismiss = useCallback(() => {
    clearAllTimers();
    setPhase('exiting');
    const dismissTimer = window.setTimeout(() => {
      setIsVisible(false);
      markCompleted();
      onComplete?.();
    }, 500);
    timersRef.current.push(dismissTimer);
  }, [markCompleted, onComplete]);

  // Support Escape key to skip intro
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleDismiss]);

  // Monitor tab visibility and inactivity while on the site
  useEffect(() => {
    const updateActiveTime = () => {
      try {
        localStorage.setItem(STORAGE_LAST_ACTIVE_KEY, Date.now().toString());
      } catch {}
    };

    updateActiveTime();
    const activeInterval = window.setInterval(updateActiveTime, 10000);

    const handleReturn = () => {
      if (document.visibilityState === 'visible') {
        try {
          const lastActive = parseInt(localStorage.getItem(STORAGE_LAST_ACTIVE_KEY) || '0', 10);
          if (lastActive && Date.now() - lastActive > INACTIVITY_TIMEOUT_MS) {
            clearAllTimers();
            setPhase('entering');
            setProgress(0);
            setIsVisible(true);
          }
        } catch {}
        updateActiveTime();
      }
    };

    document.addEventListener('visibilitychange', handleReturn);
    window.addEventListener('focus', handleReturn);

    return () => {
      window.clearInterval(activeInterval);
      document.removeEventListener('visibilitychange', handleReturn);
      window.removeEventListener('focus', handleReturn);
    };
  }, []);

  // Main 10-second luxury animation sequence
  useEffect(() => {
    if (!isVisible) return;

    clearAllTimers();
    setPhase('entering');
    setProgress(0);

    // Progress bar animation step
    const progressTimer = window.setTimeout(() => {
      setProgress(100);
    }, 50);
    timersRef.current.push(progressTimer);

    // 2.0s: Shimmer & ambient expansion
    const shimmerTimer = window.setTimeout(() => {
      setPhase('shimmer');
    }, 2000);
    timersRef.current.push(shimmerTimer);

    // 4.5s: Haute couture brand typography & divider reveal
    const brandTimer = window.setTimeout(() => {
      setPhase('brand');
    }, 4500);
    timersRef.current.push(brandTimer);

    // 7.2s: Radiance & pinnacle crest breathing
    const radianceTimer = window.setTimeout(() => {
      setPhase('radiance');
    }, 7200);
    timersRef.current.push(radianceTimer);

    // 8.8s: Graceful fade-out into storefront
    const exitTimer = window.setTimeout(() => {
      setPhase('exiting');
    }, 8800);
    timersRef.current.push(exitTimer);

    // 10.0s: Fully unmount after 10 seconds
    const finishTimer = window.setTimeout(() => {
      setIsVisible(false);
      markCompleted();
      onComplete?.();
    }, 10000);
    timersRef.current.push(finishTimer);

    return () => {
      clearAllTimers();
    };
  }, [isVisible, markCompleted, onComplete]);

  if (!isVisible) return null;

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const logoUrl = `${basePath}/logo.png`;

  const isAtLeastShimmer = phase === 'shimmer' || phase === 'brand' || phase === 'radiance' || phase === 'exiting';
  const isAtLeastBrand = phase === 'brand' || phase === 'radiance' || phase === 'exiting';
  const isRadiance = phase === 'radiance' || phase === 'exiting';
  const isExiting = phase === 'exiting';

  return (
    <div
      role="status"
      aria-label="Noble Luxe Experience"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#050505] transition-all duration-[1200ms] ease-out select-none ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 45%, #151518 0%, #0a0a0c 55%, #030304 100%)',
      }}
    >
      {/* Subtle Luxury Film Grain / Noise Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Bar with Brand Monogram & High-Contrast Skip Action */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between p-6 sm:p-8 z-20 pointer-events-auto">
        <div className="text-[10px] tracking-[0.3em] font-mono-brand uppercase text-zinc-500 font-light opacity-80">
          EDITION 2026
        </div>

        {/* Clear Luxury Skip Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="group flex items-center gap-2.5 px-4 py-2 rounded-full border border-amber-400/30 bg-black/40 hover:bg-white/[0.08] backdrop-blur-md text-[11px] tracking-[0.25em] font-mono-brand uppercase text-zinc-200 hover:text-white hover:border-amber-400/60 shadow-lg shadow-black/40 transition-all duration-300 active:scale-95 cursor-pointer"
          aria-label="Skip introduction"
        >
          <span className="font-medium text-amber-200/90 group-hover:text-amber-100">SKIP</span>
          <span className="text-[10px] text-zinc-400 group-hover:text-white group-hover:translate-x-1 transition-transform duration-300">
            →
          </span>
        </button>
      </div>

      {/* Center Stage: Ambient Warmth + Logo Emblem + Brand Typography */}
      <div className="relative flex flex-col items-center justify-center px-6 max-w-sm sm:max-w-md w-full">
        {/* Multilayer Ambient Warmth & Halo */}
        <div
          className={`absolute -top-12 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-gradient-to-tr from-amber-600/15 via-amber-500/10 to-yellow-500/5 blur-3xl pointer-events-none transition-all duration-[2000ms] ease-out ${
            phase === 'entering'
              ? 'scale-75 opacity-0'
              : isRadiance
              ? 'scale-125 opacity-90'
              : 'scale-105 opacity-60'
          }`}
        />

        <div
          className={`absolute h-40 w-40 rounded-full bg-white/5 blur-2xl pointer-events-none transition-all duration-[1500ms] ease-out ${
            isAtLeastShimmer ? 'opacity-80 scale-110' : 'opacity-0 scale-50'
          }`}
        />

        {/* Logo Card with Precision Frame & Shimmer Sweep */}
        <div
          className={`relative overflow-hidden rounded-3xl p-1 shadow-2xl transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            phase === 'entering'
              ? 'opacity-0 scale-[0.86] translate-y-3'
              : isRadiance
              ? 'opacity-100 scale-[1.025] translate-y-0'
              : 'opacity-100 scale-100 translate-y-0'
          }`}
          style={{
            boxShadow: isAtLeastShimmer
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px -5px rgba(217, 119, 6, 0.15)'
              : '0 20px 40px -15px rgba(0, 0, 0, 0.9)',
          }}
        >
          <div className="relative rounded-[22px] overflow-hidden bg-gradient-to-b from-white/[0.08] to-white/[0.01] p-3 sm:p-4 backdrop-blur-sm border border-white/10">
            <img
              src={logoUrl}
              alt="NOBLE LUXE"
              className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 object-contain rounded-xl select-none"
              loading="eager"
              decoding="async"
            />

            {/* Specular Diagonal Light Sheen */}
            <div
              className={`absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/25 to-transparent transition-transform duration-[2200ms] ease-in-out ${
                isAtLeastShimmer ? 'translate-x-[200%]' : '-translate-x-[200%]'
              }`}
            />
          </div>
        </div>

        {/* Refined Brand Header & Couture Tagline */}
        <div className="mt-8 flex flex-col items-center text-center">
          {/* Brand Wordmark with Smooth Tracking Expansion */}
          <div
            className={`font-display text-sm sm:text-base md:text-lg font-semibold uppercase text-zinc-100 transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isAtLeastBrand
                ? 'opacity-100 tracking-[0.38em] translate-y-0'
                : 'opacity-0 tracking-[0.22em] translate-y-2'
            }`}
          >
            NOBLE LUXE
          </div>

          {/* Golden Center Hairline Divider */}
          <div
            className={`my-3 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent transition-all duration-1000 ease-out ${
              isAtLeastBrand ? 'w-24 sm:w-32 opacity-100' : 'w-0 opacity-0'
            }`}
          />

          {/* Subtitle / Couture Identity */}
          <div
            className={`tracking-[0.28em] text-[10px] sm:text-[11px] uppercase text-zinc-400 font-light transition-all duration-[1200ms] delay-150 ease-out ${
              isAtLeastBrand
                ? 'opacity-90 translate-y-0'
                : 'opacity-0 translate-y-1'
            }`}
          >
            HAUTE COUTURE • LAGOS
          </div>
        </div>
      </div>

      {/* Luxury Progress Indicator (Runs smoothly across the 10-second cadence) */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/[0.04]">
        <div
          className="h-full bg-gradient-to-r from-amber-500/20 via-amber-400/80 to-amber-200 transition-all ease-linear"
          style={{
            width: `${progress}%`,
            transitionDuration: '8800ms',
          }}
        />
      </div>

      {/* Subtle Bottom Ambient Tagline */}
      <div
        className={`absolute bottom-6 text-[9px] tracking-[0.35em] uppercase text-zinc-500 font-mono-brand transition-opacity duration-1000 ${
          isAtLeastBrand ? 'opacity-80' : 'opacity-0'
        }`}
      >
        DEFINING LEGACY SINCE 2026
      </div>
    </div>
  );
}
