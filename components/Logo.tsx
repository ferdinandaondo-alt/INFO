'use client';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`group inline-flex items-center gap-2 font-display font-bold text-xl tracking-tight text-paper ${className}`}>
      <span className="relative inline-block h-2 w-2 rounded-full bg-signal">
        <span className="absolute inset-0 rounded-full bg-signal animate-ping opacity-60 group-hover:opacity-100" />
      </span>
      INFO
      <span className="font-mono text-[10px] font-normal tracking-[0.2em] text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        //ACTIVE
      </span>
    </span>
  );
}
