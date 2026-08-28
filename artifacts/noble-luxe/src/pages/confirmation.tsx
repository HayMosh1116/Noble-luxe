import { useMemo } from 'react';
import { Link, useParams } from 'wouter';
import { ArrowRight, Check, Copy, PackageCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/catalog';

export default function Confirmation() {
  const params = useParams<{ orderId: string }>();
  const order = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem(`noble-luxe-order-${params.orderId}`) || 'null') as { orderId: string; receivedAt: string; total: number; message?: string } | null; } catch { return null; }
  }, [params.orderId]);
  const total = order?.total || 0;
  return (
    <div className="noble-noise flex min-h-[100dvh] flex-col">
      <header className="border-b border-border"><div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-center px-5"><Link href="/" className="font-display text-lg tracking-[0.15em]" data-testid="link-confirmation-brand">NOBLE LUXE</Link></div></header>
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-20"><div className="absolute left-[-8vw] top-[12%] font-display text-[30vw] leading-none text-primary/[.035]">N</div><div className="relative z-10 w-full max-w-2xl text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center border border-primary text-primary"><PackageCheck className="h-7 w-7" strokeWidth={1.2} /></div><p className="mt-10 font-mono-brand text-[10px] uppercase tracking-[0.25em] text-primary">Order received / private access</p><h1 className="mt-4 font-display text-[clamp(3.5rem,8vw,7rem)] leading-[.9] tracking-[-.055em]">Order secured.</h1><p className="mx-auto mt-8 max-w-md text-sm leading-[1.9] text-muted-foreground"> {order?.message || 'Your order has been received successfully. We will verify your payment and contact you shortly to confirm your order and arrange delivery.'}
 </p><div className="mx-auto mt-12 max-w-md border-y border-border py-6 text-left"><div className="flex items-center justify-between py-2"><span className="font-mono-brand text-[9px] uppercase tracking-[0.16em] text-muted-foreground">Order ID</span><span className="flex items-center gap-2 font-mono-brand text-xs text-primary" data-testid="text-order-id">{params.orderId}<button onClick={() => navigator.clipboard?.writeText(params.orderId || '')} className="text-muted-foreground hover:text-primary" aria-label="Copy order ID" data-testid="button-copy-order-id"><Copy className="h-3.5 w-3.5" /></button></span></div><div className="flex items-center justify-between py-2"><span className="font-mono-brand text-[9px] uppercase tracking-[0.16em] text-muted-foreground">Total secured</span><span className="font-mono-brand text-xs text-foreground" data-testid="text-order-total">{formatCurrency(total)}</span></div><div className="flex items-center justify-between py-2"><span className="font-mono-brand text-[9px] uppercase tracking-[0.16em] text-muted-foreground">Status</span><span className="flex items-center gap-1.5 font-mono-brand text-[9px] uppercase tracking-wider text-primary" data-testid="status-order-received"><Check className="h-3.5 w-3.5" /> Awaiting verification</span></div></div><Link href="/" className="mt-10 inline-flex items-center border-b border-primary pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary transition hover:text-accent" data-testid="link-continue-shopping">Continue through the showroom <ArrowRight className="ml-2 h-4 w-4" /></Link></div></main><footer className="px-5 py-8 text-center font-mono-brand text-[9px] uppercase tracking-[0.16em] text-muted-foreground">Thank you for choosing the considered option.</footer>
    </div>
  );
}
