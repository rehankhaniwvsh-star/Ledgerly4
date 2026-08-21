import React, { useState } from 'react';
import { HeroData, BrandSettings } from '../types';
import { ArrowRight, Check, Star, Sparkles, Zap, Shield, Copy, CheckCircle2, ArrowUpRight, Smartphone } from 'lucide-react';
import { ReceiptLogoIcon } from './BrandLogo';
import BrainCircuitIcon from './icons/BrainCircuitIcon';

interface HeroSectionProps {
  hero: HeroData;
  brand: BrandSettings;
  onOpenGenerator: () => void;
  onOpenDashboard: () => void;
  onOpenCms: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  hero,
  brand,
  onOpenGenerator,
  onOpenDashboard,
}) => {
  const [invoiceStatus, setInvoiceStatus] = useState<'Paid' | 'Sent' | 'Draft'>('Paid');
  const [copiedBank, setCopiedBank] = useState(false);

  const toggleStatus = () => {
    if (invoiceStatus === 'Paid') setInvoiceStatus('Sent');
    else if (invoiceStatus === 'Sent') setInvoiceStatus('Draft');
    else setInvoiceStatus('Paid');
  };

  const copyBankInfo = () => {
    navigator.clipboard?.writeText('50200084729103 - HDFC Bank / Chase');
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  return (
    <section className="px-3 sm:px-6 pt-4 pb-12 sm:pb-20">
      {/* Outer Framed Warm Canvas matching the inspiration composition */}
      <div className="max-w-7xl mx-auto rounded-[2rem] sm:rounded-[2.8rem] bg-[#FAF6F0] dark:bg-[#15141C] border border-[#EFE5D5] dark:border-[#262432] p-6 sm:p-12 lg:p-16 relative overflow-hidden shadow-sm">
        
        {/* Soft Warm Sunrise Radial Glow Aura in the background */}
        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-gradient-to-bl from-orange-400/20 via-amber-300/15 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute -bottom-24 -left-24 w-[450px] h-[450px] bg-gradient-to-tr from-orange-300/10 via-amber-200/5 to-transparent rounded-full blur-2xl pointer-events-none -z-0" />

        {/* Floating Playful Accents */}
        {/* Floating Green Checkmark Badge */}
        <div className="hidden md:flex absolute top-12 left-[44%] -translate-x-1/2 z-20 items-center justify-center w-10 h-10 rounded-2xl bg-white dark:bg-[#1E1D27] shadow-lg shadow-emerald-500/10 border border-[#EBE3D5] dark:border-[#2C2A3A] text-emerald-600 animate-bounce duration-1000">
          <Check className="w-5 h-5 stroke-[3]" />
        </div>

        {/* Floating 4-pointed Warm Orange Star */}
        <div className="hidden sm:block absolute bottom-28 left-[45%] z-20 text-[#FF6D00] text-3xl opacity-85 select-none pointer-events-none animate-pulse">
          ✦
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.05fr_1.15fr] gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Headline & Value Proposition */}
          <div className="space-y-6 sm:space-y-8 text-left">
            
            {/* Top Soft Peach Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FFF0E6] dark:bg-[#2A1914] border border-[#FFD8C2] dark:border-[#422419] rounded-full px-4 py-1.5 shadow-xs">
              <span className="text-[#E65100] dark:text-[#FF8A65] text-xs font-black tracking-wide">
                ✦ Premium Invoiceify
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]"></span>
              <span className="text-[11px] font-semibold text-[#8D4A2B] dark:text-[#D1977D]">
                v2.5 Release
              </span>
            </div>

            {/* Massive Bold Headline matching inspiration */}
            <div className="space-y-1">
              <h1 className="text-5xl sm:text-6xl lg:text-[4.75rem] font-black text-[#0A1128] dark:text-[#F8F9FA] leading-[1.02] tracking-[-0.04em]">
                Meet <br />
                <span className="relative inline-block text-[#0A1128] dark:text-white">
                  Invoiceify<span className="text-[#FF5722]">.</span>
                </span>
              </h1>
            </div>

            {/* Engaging Subtitle */}
            <p className="text-[#555A68] dark:text-[#A6A9B6] text-base sm:text-lg leading-relaxed max-w-lg font-medium">
              Permute away your frustrating invoicing workflow. Invoiceify delivers instant, beautifully branded invoices with automatic bank remittance, audit checks, and one-click PDF generation.
            </p>

            {/* CTA Buttons Row matching inspiration */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              {/* Primary Vibrant Orange Button */}
              <button
                onClick={onOpenGenerator}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#FF5722] hover:bg-[#F4511E] text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
              >
                <span>Start Invoicing</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary Dark Obsidian Pill Button */}
              <button
                onClick={onOpenDashboard}
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#111116] hover:bg-[#22222A] text-white font-bold text-sm transition-all duration-200 shadow-md hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
              >
                <span>Values & Demo</span>
              </button>

              {/* Tertiary Link */}
              <button
                onClick={onOpenGenerator}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0A1128] dark:text-[#E0E2EC] hover:text-[#FF5722] transition-colors py-2 px-1 cursor-pointer group"
              >
                <span>Go Studio</span>
                <ArrowUpRight className="w-4 h-4 text-[#FF5722] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Trust Reviews Strip */}
            <div className="pt-4 flex items-center gap-3 border-t border-[#EBE3D5] dark:border-[#282635]">
              <div className="flex -space-x-2">
                <img
                  className="w-7 h-7 rounded-full ring-2 ring-[#FAF6F0] dark:ring-[#15141C] object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces"
                  alt="User"
                />
                <img
                  className="w-7 h-7 rounded-full ring-2 ring-[#FAF6F0] dark:ring-[#15141C] object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces"
                  alt="User"
                />
                <img
                  className="w-7 h-7 rounded-full ring-2 ring-[#FAF6F0] dark:ring-[#15141C] object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces"
                  alt="User"
                />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span className="text-xs font-bold text-[#0A1128] dark:text-white">4.9 / 5.0</span>
                </div>
                <span className="text-[11px] text-[#707584] dark:text-[#8E92A4] font-medium">
                  Trusted by 10,000+ modern creators & agencies
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Layered Smartphone & Floating Invoice Document */}
          <div className="relative flex items-center justify-center lg:justify-end">
            
            {/* Ambient Lighting Behind Devices */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/25 via-pink-400/15 to-amber-300/20 blur-2xl rounded-full -z-0 pointer-events-none" />

            <div className="relative w-full max-w-[540px] flex items-center justify-center">
              
              {/* 1. Mobile Phone Mockup (Angled Left Layer) */}
              <div className="hidden sm:block absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 w-48 sm:w-56 h-[370px] sm:h-[420px] bg-[#101014] rounded-[2.2rem] p-2.5 shadow-2xl border-[3px] border-[#2A2A35] rotate-[-7deg] hover:rotate-[-2deg] transition-all duration-500 z-10 select-none">
                {/* Phone Speaker & Camera Notch */}
                <div className="w-20 h-3.5 bg-[#1C1C24] rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0A0A0E]"></div>
                </div>

                {/* Mobile Screen UI */}
                <div className="w-full h-[calc(100%-1.8rem)] bg-white dark:bg-[#1A1924] rounded-[1.6rem] p-3 text-left overflow-hidden flex flex-col justify-between">
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-1.5">
                        <ReceiptLogoIcon sizeClass="w-5 h-5" />
                        <span className="font-black text-[11px] text-gray-900 dark:text-white">Invoiceify</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-2.5 p-2 bg-[#FFF7F0] dark:bg-[#251D19] rounded-xl border border-[#FFE7D6] dark:border-[#38261E]">
                      <span className="text-[9px] font-bold text-[#E65100] uppercase tracking-wider block">Active Balance</span>
                      <span className="text-base font-black text-gray-900 dark:text-white font-mono">$4,850.00</span>
                    </div>

                    {/* Mini Form Inputs */}
                    <div className="mt-2.5 space-y-1.5">
                      <div className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 p-1.5 rounded-lg border border-gray-100 dark:border-gray-700/60 flex justify-between">
                        <span>Client</span>
                        <span className="font-bold text-gray-900 dark:text-white">Vionne Studio</span>
                      </div>
                      <div className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 p-1.5 rounded-lg border border-gray-100 dark:border-gray-700/60 flex justify-between">
                        <span>Amount</span>
                        <span className="font-bold text-orange-600 font-mono">$799.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Action Button */}
                  <div className="pt-2">
                    <div className="w-full py-1.5 rounded-xl bg-[#FF5722] text-white text-center text-[10px] font-bold shadow-xs">
                      Send Invoice
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Floating High-Fidelity Desktop Invoice Sheet (Main Layer) */}
              <div className="relative sm:ml-20 w-full sm:w-[410px] bg-white dark:bg-[#1A1926] rounded-2xl sm:rounded-3xl border border-[#E9DFC6] dark:border-[#2F2C40] p-5 sm:p-6 shadow-2xl shadow-orange-950/10 z-20 text-left transition-all duration-300 hover:shadow-orange-500/10">
                
                {/* Floating Top-Right Sync / Verified Badge */}
                <div className="absolute -top-3.5 -right-2.5 z-30 bg-[#FF5722] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1 border-2 border-white dark:border-[#15141C] animate-pulse">
                  <Zap className="w-3 h-3 fill-white" />
                  <span>Instant Remit</span>
                </div>

                {/* Invoice Document Header */}
                <div className="flex items-start justify-between pb-3.5 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2.5">
                    <ReceiptLogoIcon sizeClass="w-9 h-9" />
                    <div>
                      <h3 className="font-black text-sm text-gray-900 dark:text-white leading-tight">Invoiceify</h3>
                      <p className="text-[10px] text-gray-500 font-medium">Invoices, paid faster</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/40 rounded-md border border-orange-200 dark:border-orange-800/50">
                      #INV-2026-0042
                    </span>
                    <p className="text-[9px] text-gray-400 mt-0.5">Due: July 15, 2026</p>
                  </div>
                </div>

                {/* Client Billed-To & Status Row */}
                <div className="py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Billed To</span>
                    <p className="text-xs font-extrabold text-gray-900 dark:text-white">Vionne Studio Ltd.</p>
                    <p className="text-[10px] text-gray-500 font-mono">billing@vionne.co</p>
                  </div>

                  {/* Interactive Status Switcher */}
                  <button
                    onClick={toggleStatus}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black cursor-pointer transition-all ${
                      invoiceStatus === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                        : invoiceStatus === 'Sent'
                        ? 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800'
                        : 'bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
                    }`}
                    title="Click to toggle status"
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        invoiceStatus === 'Paid' ? 'bg-emerald-500' : invoiceStatus === 'Sent' ? 'bg-orange-500' : 'bg-zinc-400'
                      }`}
                    />
                    <span>{invoiceStatus}</span>
                  </button>
                </div>

                {/* Line Items Table */}
                <div className="py-2.5 space-y-2 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">1. UI/UX Design System</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">$250.00</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">2. Full-Stack Web App</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">$350.00</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">3. Brand Identity Kit</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">$180.00</span>
                  </div>
                </div>

                {/* Calculation Breakdown: Subtotal + Tax - Discount = Grand Total */}
                <div className="py-2.5 space-y-1 text-[11px] border-b border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal:</span>
                    <span className="font-mono font-semibold">$780.00</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Tax (+5%):</span>
                    <span className="font-mono font-semibold text-emerald-600">+$39.00</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Discount (-$20):</span>
                    <span className="font-mono font-semibold text-rose-500">-$20.00</span>
                  </div>
                  <div className="flex justify-between pt-1 font-black text-sm text-gray-900 dark:text-white">
                    <span>Total Due:</span>
                    <span className="font-mono text-base text-[#FF5722]">$799.00</span>
                  </div>
                </div>

                {/* Bank Details Remittance Box */}
                <div className="mt-3 p-2.5 rounded-xl bg-[#FFF8F2] dark:bg-[#251C17] border border-[#FFE6D4] dark:border-[#3D281E] flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[9px] font-extrabold text-[#E65100] uppercase tracking-wider block">
                      🏦 Bank Remittance
                    </span>
                    <p className="text-[10px] font-bold text-gray-800 dark:text-gray-200">
                      HDFC Bank / Chase · <span className="font-mono text-gray-600 dark:text-gray-400">#...9103</span>
                    </p>
                  </div>
                  <button
                    onClick={copyBankInfo}
                    className="p-1.5 rounded-lg bg-white dark:bg-[#1E1916] border border-[#FFD9C2] dark:border-[#4D3325] text-orange-600 hover:bg-orange-50 cursor-pointer transition-colors"
                    title="Copy Bank Details"
                  >
                    {copiedBank ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Card Action Link */}
                <div className="mt-3.5 flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-[11px]">
                  <span className="text-gray-400 font-medium">Click to customize live</span>
                  <button
                    onClick={onOpenGenerator}
                    className="font-bold text-[#FF5722] hover:text-[#E65100] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Open in Studio</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Core Features Bar matching the inspiration aesthetic */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-[#EBE3D5] dark:border-[#282635] grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#0A1128] dark:text-white">0.3s Instant PDF</h4>
              <p className="text-[11px] text-[#6E7382] dark:text-[#9EA2B2] leading-tight">Pixel-perfect vector export with one click.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#0A1128] dark:text-white">100% Private</h4>
              <p className="text-[11px] text-[#6E7382] dark:text-[#9EA2B2] leading-tight">Client numbers never leave your browser.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
              <BrainCircuitIcon size={16} color="#FF5722" strokeWidth={2.2} />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#0A1128] dark:text-white">Bank Remittance</h4>
              <p className="text-[11px] text-[#6E7382] dark:text-[#9EA2B2] leading-tight">Embed direct wire & IFSC account details.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#0A1128] dark:text-white">Zero Watermarks</h4>
              <p className="text-[11px] text-[#6E7382] dark:text-[#9EA2B2] leading-tight">Custom brand colors, logo & typography.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

