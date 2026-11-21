import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Phone,
  Sparkles,
  Tv,
  Wifi,
} from 'lucide-react';
import { Lang, TRANSLATIONS } from '../i18n';
import { WhatsAppIcon } from './WhatsAppIcon';

type OfferTabId = 'fiber' | 'broadband' | 'tvLine' | 'promos';

interface PtclOffersHubProps {
  lang: Lang;
  onBookPackage?: (packageSummary: string) => void;
}

const TAB_ICONS: Record<OfferTabId, typeof Wifi> = {
  fiber: Wifi,
  broadband: Globe,
  tvLine: Tv,
  promos: Sparkles,
};

export function PtclOffersHub({ lang, onBookPackage }: PtclOffersHubProps) {
  const [activeTab, setActiveTab] = useState<OfferTabId>('fiber');
  const scrollerRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];
  const offers = t.ptclOffers;

  const makeWhatsappUrl = (packageTitle: string) =>
    `https://wa.me/923421229495?text=${encodeURIComponent(
      `Assalam-o-Alaikum Faizullah Khan, I want details / installation for: ${packageTitle}`
    )}`;

  const scrollCarousel = (direction: 'prev' | 'next') => {
    const el = scrollerRef.current;
    if (!el) return;
    const isRtl = lang === 'ur';
    const step = 260;
    const delta =
      direction === 'next' ? (isRtl ? -step : step) : isRtl ? step : -step;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-1 sm:mb-2">
            <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="#65B32E" strokeWidth="2.2" strokeDasharray="48 12" />
              <circle cx="12" cy="12" r="6" stroke="#007A33" strokeWidth="2" strokeDasharray="28 10" />
              <circle cx="12" cy="12" r="2.4" fill="#007A33" />
            </svg>
            <p className="text-[10.5px] sm:text-xs font-semibold tracking-wide text-[#007A33] dark:text-emerald-400">
              {offers.kicker}
            </p>
          </div>
          <h2 className="font-display text-lg sm:text-4xl font-bold tracking-[-0.02em] text-slate-950 dark:text-white text-balance">
            {offers.title}
          </h2>
          <p className="mt-1.5 sm:mt-2 text-[11.5px] sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {offers.description}
          </p>
        </div>

        <div
          className="self-start sm:self-auto inline-flex items-center gap-2 sm:block rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 text-xs shrink-0"
          dir="ltr"
        >
          <span className="text-[10.5px] sm:text-[11px] text-slate-500 dark:text-slate-400 sm:block">
            {offers.helplineLabel}
          </span>
          <span className="font-mono font-bold text-xs sm:text-sm text-[#0B2241] dark:text-white">
            PTCL 1218
          </span>
        </div>
      </div>

      {/* 4 Interactive PTCL Service & Offer Tabs */}
      <div
        role="tablist"
        aria-label={offers.title}
        className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800"
      >
        {offers.tabs.map((tab) => {
          const id = tab.id as OfferTabId;
          const Icon = TAB_ICONS[id];
          const isActive = activeTab === id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActiveTab(id);
                if (scrollerRef.current) {
                  scrollerRef.current.scrollTo({ left: 0, behavior: 'auto' });
                }
              }}
              className={`inline-flex items-center justify-start sm:justify-center gap-2 min-h-[42px] sm:min-h-[46px] px-2.5 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-sm font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007A33]/60 dark:focus-visible:ring-emerald-400/60 ${
                isActive
                  ? 'bg-gradient-to-r from-[#007A33] to-[#0B5D3B] dark:from-emerald-600 dark:to-teal-600 text-white border border-transparent shadow-md shadow-emerald-950/15'
                  : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-[#007A33] dark:hover:text-emerald-300'
              }`}
            >
              <span
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-[#007A33] dark:text-emerald-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
              <span className="sm:hidden leading-tight truncate">{tab.shortLabel}</span>
              <span className="hidden sm:inline truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="space-y-3 sm:space-y-6"
      >
        {(activeTab === 'fiber' || activeTab === 'broadband') && (() => {
          const data = activeTab === 'fiber' ? offers.fiber : offers.broadband;
          return (
            <>
              <div className="rounded-xl sm:rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 bg-gradient-to-r from-emerald-50/85 via-white to-sky-50/60 dark:from-emerald-950/30 dark:via-slate-900 dark:to-sky-950/20 p-3 sm:p-5">
                <h3 className="font-display text-xs sm:text-lg font-bold text-[#0B2241] dark:text-emerald-200">
                  {data.summaryTitle}
                </h3>
                <p className="mt-1 text-[11px] sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {data.summaryDesc}
                </p>
              </div>

              {/* Mobile Horizontal Scroll Controls */}
              <div className="flex sm:hidden items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {offers.swipeHint}
                </span>
                <div className="inline-flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => scrollCarousel('prev')}
                    aria-label="Scroll previous packages"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 active:scale-95 transition-transform cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007A33]/60"
                  >
                    <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCarousel('next')}
                    aria-label="Scroll next packages"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 active:scale-95 transition-transform cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007A33]/60"
                  >
                    <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </div>
              </div>

              {/* Mobile: Compact Horizontal Snap-Scroll | Tablet/Desktop: Grid */}
              <div
                ref={scrollerRef}
                className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5 overflow-x-auto sm:overflow-visible snap-x snap-mandatory no-scrollbar -mx-3.5 px-3.5 pb-1 sm:mx-0 sm:px-0 sm:pb-0"
              >
                {data.plans.map((plan) => {
                  const isFeatured = 'featured' in plan && Boolean(plan.featured);
                  const pkgLabel = `${activeTab === 'fiber' ? 'PTCL Flash Fiber' : 'PTCL Broadband'} ${plan.speed} (${plan.price})`;
                  return (
                    <article
                      key={plan.speed}
                      className={`snap-start shrink-0 w-[74vw] max-w-[260px] sm:w-auto sm:max-w-none rounded-2xl border overflow-hidden flex flex-col justify-between transition-all ${
                        isFeatured
                          ? 'border-[#007A33]/80 dark:border-emerald-500/80 bg-white dark:bg-slate-900 shadow-md shadow-emerald-950/10'
                          : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm hover:border-emerald-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div
                          className={`h-1 w-full ${
                            isFeatured
                              ? 'bg-gradient-to-r from-[#0B2241] via-[#007A33] to-[#65B32E]'
                              : 'bg-gradient-to-r from-slate-200 via-emerald-300/70 to-slate-200 dark:from-slate-800 dark:via-emerald-700/60 dark:to-slate-800'
                          }`}
                          aria-hidden="true"
                        />
                        <div
                          className={`px-3 pt-2.5 pb-2 sm:px-5 sm:pt-4 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800 flex items-baseline justify-between gap-2 ${
                            isFeatured
                              ? 'bg-gradient-to-br from-emerald-50/85 via-white to-slate-50/60 dark:from-emerald-950/35 dark:via-slate-900 dark:to-slate-900'
                              : 'bg-slate-50/75 dark:bg-slate-800/40'
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="text-[10px] sm:text-[11px] font-semibold tracking-wide text-[#007A33] dark:text-emerald-400 truncate">
                              {plan.tag}
                            </p>
                            <h4
                              dir="ltr"
                              className="font-display text-base sm:text-2xl font-bold text-slate-950 dark:text-white mt-0.5 rtl:text-right"
                            >
                              {plan.speed}
                            </h4>
                          </div>
                          <div className="text-end shrink-0" dir="ltr">
                            <span className="font-mono text-sm sm:text-xl font-bold text-[#0B2241] dark:text-emerald-300 tabular-nums">
                              {plan.price}
                            </span>
                            <span className="inline sm:block ms-1 sm:ms-0 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                              {offers.perMonth}
                            </span>
                          </div>
                        </div>

                        <div className="px-3 pt-2.5 sm:px-5 sm:pt-3.5">
                          <p className="text-[11px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 line-clamp-1 sm:line-clamp-none">
                            {plan.useCase}
                          </p>

                          <ul className="mt-2 sm:mt-3 space-y-1 sm:space-y-2">
                            {plan.features.map((feat) => (
                              <li
                                key={feat}
                                className="flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 leading-snug"
                              >
                                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#007A33] dark:text-emerald-400 mt-0.5 shrink-0" />
                                <span className="line-clamp-1 sm:line-clamp-none">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-3 sm:mt-4 px-3 pb-3 pt-2.5 sm:px-5 sm:pb-5 sm:pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 sm:gap-2">
                        <a
                          href={makeWhatsappUrl(pkgLabel)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${offers.ctaWhatsapp} - ${plan.speed}`}
                          className="inline-flex items-center justify-center gap-1.5 min-h-[36px] sm:min-h-[42px] px-2.5 sm:px-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 text-[#128C7E] dark:text-[#4ADE80] border border-[#25D366]/35 dark:border-[#25D366]/40 text-[11px] sm:text-xs font-semibold hover:bg-[#25D366] hover:text-white hover:border-[#25D366] dark:hover:bg-[#25D366] dark:hover:text-white transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/60"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                          <span>{offers.ctaWhatsapp}</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => onBookPackage?.(pkgLabel)}
                          className="flex-1 inline-flex items-center justify-center gap-1 sm:gap-1.5 min-h-[36px] sm:min-h-[42px] px-2.5 sm:px-3 rounded-xl bg-[#0B2241] dark:bg-sky-600 text-white text-[11px] sm:text-xs font-semibold hover:bg-[#13325C] dark:hover:bg-sky-500 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
                        >
                          <span className="truncate">{offers.ctaBook}</span>
                          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 rtl:rotate-180 shrink-0" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          );
        })()}

        {activeTab === 'tvLine' && (
          <>
            <div className="rounded-xl sm:rounded-2xl border border-sky-200/80 dark:border-sky-900/60 bg-gradient-to-r from-sky-50/85 via-white to-emerald-50/50 dark:from-sky-950/30 dark:via-slate-900 dark:to-emerald-950/20 p-3 sm:p-5">
              <h3 className="font-display text-xs sm:text-lg font-bold text-[#0B2241] dark:text-sky-200">
                {offers.tvLine.summaryTitle}
              </h3>
              <p className="mt-1 text-[11px] sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
                {offers.tvLine.summaryDesc}
              </p>
            </div>

            <div className="flex lg:hidden items-center justify-between gap-2">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {offers.swipeHint}
              </span>
              <div className="inline-flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollCarousel('prev')}
                  aria-label="Scroll previous packages"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 active:scale-95 transition-transform cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007A33]/60"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel('next')}
                  aria-label="Scroll next packages"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 active:scale-95 transition-transform cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007A33]/60"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>

            <div
              ref={scrollerRef}
              className="flex lg:grid lg:grid-cols-3 gap-2.5 sm:gap-5 overflow-x-auto lg:overflow-visible snap-x snap-mandatory no-scrollbar -mx-3.5 px-3.5 pb-1 lg:mx-0 lg:px-0 lg:pb-0"
            >
              {offers.tvLine.items.map((item) => (
                <article
                  key={item.title}
                  className="snap-start shrink-0 w-[80vw] max-w-[275px] sm:w-[320px] lg:w-auto lg:max-w-none rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-sm flex flex-col justify-between hover:border-sky-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div>
                    <div
                      className="h-1 w-full bg-gradient-to-r from-[#0B2241] via-sky-600 to-[#007A33]"
                      aria-hidden="true"
                    />
                    <div className="px-3 pt-2.5 pb-2 sm:px-5 sm:pt-4 sm:pb-3.5 bg-slate-50/75 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
                      <p
                        dir="ltr"
                        className="font-mono text-[10.5px] sm:text-xs font-semibold text-[#007A33] dark:text-emerald-400 rtl:text-right"
                      >
                        {item.price}
                      </p>
                      <h4 className="mt-1 font-display text-sm sm:text-xl font-bold text-slate-950 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="mt-0.5 text-[11px] sm:text-sm text-slate-600 dark:text-slate-300 leading-snug">
                        {item.subtitle}
                      </p>
                    </div>

                    <ul className="px-3 pt-2.5 sm:px-5 sm:pt-3.5 space-y-1.5 sm:space-y-2">
                      {item.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 leading-snug"
                        >
                          <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#007A33] dark:text-emerald-400 mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-3 sm:mt-4 px-3 pb-3 pt-2.5 sm:px-5 sm:pb-5 sm:pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 sm:gap-2">
                    <a
                      href={makeWhatsappUrl(item.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 min-h-[36px] sm:min-h-[42px] px-2.5 sm:px-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 text-[#128C7E] dark:text-[#4ADE80] border border-[#25D366]/35 dark:border-[#25D366]/40 text-[11px] sm:text-xs font-semibold hover:bg-[#25D366] hover:text-white hover:border-[#25D366] dark:hover:bg-[#25D366] dark:hover:text-white transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/60"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span>{offers.ctaWhatsapp}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => onBookPackage?.(item.title)}
                      className="flex-1 inline-flex items-center justify-center gap-1 sm:gap-1.5 min-h-[36px] sm:min-h-[42px] px-2.5 sm:px-3 rounded-xl bg-[#0B2241] dark:bg-sky-600 text-white text-[11px] sm:text-xs font-semibold hover:bg-[#13325C] dark:hover:bg-sky-500 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
                    >
                      <span className="truncate">{offers.ctaBook}</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 rtl:rotate-180 shrink-0" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {activeTab === 'promos' && (
          <>
            <div className="rounded-xl sm:rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 bg-gradient-to-r from-emerald-50 via-white to-sky-50 dark:from-emerald-950/35 dark:via-slate-900 dark:to-sky-950/25 p-3 sm:p-5">
              <h3 className="font-display text-xs sm:text-lg font-bold text-[#0B2241] dark:text-white">
                {offers.promos.summaryTitle}
              </h3>
              <p className="mt-1 text-[11px] sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
                {offers.promos.summaryDesc}
              </p>
            </div>

            <div className="flex lg:hidden items-center justify-between gap-2">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {offers.swipeHint}
              </span>
              <div className="inline-flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollCarousel('prev')}
                  aria-label="Scroll previous offers"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 active:scale-95 transition-transform cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007A33]/60"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel('next')}
                  aria-label="Scroll next offers"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 active:scale-95 transition-transform cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007A33]/60"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>

            <div
              ref={scrollerRef}
              className="flex lg:grid lg:grid-cols-3 gap-2.5 sm:gap-5 overflow-x-auto lg:overflow-visible snap-x snap-mandatory no-scrollbar -mx-3.5 px-3.5 pb-1 lg:mx-0 lg:px-0 lg:pb-0"
            >
              {offers.promos.items.map((promo) => (
                <article
                  key={promo.title}
                  className="snap-start shrink-0 w-[80vw] max-w-[275px] sm:w-[320px] lg:w-auto lg:max-w-none rounded-2xl border border-emerald-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-sm flex flex-col justify-between hover:border-emerald-400 dark:hover:border-emerald-700 transition-colors"
                >
                  <div>
                    <div
                      className="h-1 w-full bg-gradient-to-r from-[#007A33] via-[#65B32E] to-[#0EA5E9]"
                      aria-hidden="true"
                    />
                    <div className="px-3 pt-2.5 pb-2 sm:px-5 sm:pt-4 sm:pb-3.5 bg-gradient-to-br from-emerald-50/80 via-white to-slate-50/50 dark:from-emerald-950/35 dark:via-slate-900 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800">
                      <p
                        dir="ltr"
                        className="font-mono text-[10.5px] sm:text-xs font-bold text-[#007A33] dark:text-emerald-400 rtl:text-right"
                      >
                        {promo.highlight}
                      </p>
                      <h4 className="mt-1 font-display text-sm sm:text-xl font-bold text-slate-950 dark:text-white">
                        {promo.title}
                      </h4>
                    </div>

                    <div className="px-3 pt-2.5 sm:px-5 sm:pt-3.5">
                      <p className="text-[11px] sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {promo.desc}
                      </p>

                      <ul className="mt-2.5 sm:mt-3.5 pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 sm:space-y-2">
                        {promo.points.map((pt) => (
                          <li
                            key={pt}
                            className="flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 leading-snug"
                          >
                            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#007A33] dark:text-emerald-400 mt-0.5 shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 px-3 pb-3 pt-2.5 sm:px-5 sm:pb-5 sm:pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 sm:gap-2">
                    <a
                      href={makeWhatsappUrl(promo.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 min-h-[36px] sm:min-h-[42px] px-2.5 sm:px-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 text-[#128C7E] dark:text-[#4ADE80] border border-[#25D366]/35 dark:border-[#25D366]/40 text-[11px] sm:text-xs font-semibold hover:bg-[#25D366] hover:text-white hover:border-[#25D366] dark:hover:bg-[#25D366] dark:hover:text-white transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/60"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span>{offers.ctaWhatsapp}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => onBookPackage?.(promo.title)}
                      className="flex-1 inline-flex items-center justify-center gap-1 sm:gap-1.5 min-h-[36px] sm:min-h-[42px] px-2.5 sm:px-3 rounded-xl bg-[#0B2241] dark:bg-sky-600 text-white text-[11px] sm:text-xs font-semibold hover:bg-[#13325C] dark:hover:bg-sky-500 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
                    >
                      <span className="truncate">{offers.ctaBook}</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 rtl:rotate-180 shrink-0" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* Bottom Local Swat Booking Strip & Tariff Note */}
      <div className="rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-3 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4">
        <p className="text-[10.5px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
          {offers.disclaimer}
        </p>

        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 shrink-0 pt-2 border-t border-slate-100 dark:border-slate-800 md:pt-0 md:border-t-0">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200">
            {offers.localDeskLabel}:
          </span>
          <div className="inline-flex items-center gap-1.5 sm:gap-2" dir="ltr">
            <a
              href="tel:03421229495"
              className="font-mono text-xs sm:text-sm font-bold text-[#0B2241] dark:text-white hover:text-[#007A33] dark:hover:text-emerald-400 transition-colors"
            >
              0342-1229495
            </a>
            <a
              href="tel:03421229495"
              aria-label="Call 0342-1229495 in dialer"
              className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 hover:bg-sky-600 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
            <a
              href="https://wa.me/923421229495"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp 0342-1229495"
              className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#25D366] text-white hover:bg-[#1EBE5D] shadow-xs transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

