import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Cctv, Cpu, Globe, HardDrive, Router, Smartphone, Wifi } from 'lucide-react';
import { Lang, TRANSLATIONS } from '../i18n';

type TopologyMode = 'cctv' | 'wifi' | 'networking';

interface AnimatedTopologyIllustrationProps {
  lang: Lang;
}

export function AnimatedTopologyIllustration({ lang }: AnimatedTopologyIllustrationProps) {
  const t = TRANSLATIONS[lang].topology;
  const [mode, setMode] = useState<TopologyMode>('cctv');
  const prefersReducedMotion = useReducedMotion();
  const current = t.modes[mode];

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800/90 shadow-xl overflow-hidden">
      {/* Top Toolbar */}
      <div className="p-4 sm:p-8 border-b border-slate-200 dark:border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 sm:gap-6 bg-slate-50 dark:bg-slate-900/60">
        <div>
          <p className="text-[11px] sm:text-xs font-semibold tracking-wide text-sky-700 dark:text-sky-400 mb-1">
            {t.badge}
          </p>
          <h3 className="font-display text-base sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            {current.title}
          </h3>
        </div>

        {/* Mode Switcher */}
        <div
          className="grid grid-cols-3 sm:inline-flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800/90 rounded-xl w-full lg:w-auto border border-slate-200 dark:border-slate-700/60"
          role="tablist"
          aria-label="Technician system views"
        >
          {(Object.keys(t.modes) as TopologyMode[]).map((key) => {
            const isActive = mode === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setMode(key)}
                className={`px-2 sm:px-3.5 py-2 min-h-[42px] sm:min-h-0 rounded-lg text-[11px] sm:text-xs font-medium transition-colors cursor-pointer text-center leading-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
                }`}
              >
                {t.modes[key].tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Animated Vector Illustration Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div dir="ltr" className="lg:col-span-8 p-3.5 sm:p-8 bg-slate-950 relative overflow-hidden">
          {/* Desktop / Tablet Horizontal SVG (>= 640px) */}
          <div className="hidden sm:flex w-full aspect-[16/9] min-h-[280px] items-center justify-center">
            <svg
              viewBox="0 0 760 400"
              className="w-full h-full"
              role="img"
              aria-label={`Animated workflow illustration for ${current.title}`}
            >
              <defs>
                <pattern
                  id="topo-dots"
                  width="24"
                  height="24"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="1.5" cy="1.5" r="1" fill="#1E293B" />
                </pattern>
                <linearGradient id="fiber-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0284C7" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
              </defs>

              <rect width="760" height="400" fill="url(#topo-dots)" rx="12" />

              <path d="M 126 200 L 278 200" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
              <motion.path
                key={`p1-${mode}`}
                d="M 126 200 L 278 200"
                stroke="url(#fiber-grad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="10 14"
                animate={prefersReducedMotion ? undefined : { strokeDashoffset: [0, -48] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />

              <path d="M 358 200 L 488 200" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
              <motion.path
                key={`p2-${mode}`}
                d="M 358 200 L 488 200"
                stroke="url(#fiber-grad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="10 14"
                animate={prefersReducedMotion ? undefined : { strokeDashoffset: [0, -48] }}
                transition={{ duration: 1.35, repeat: Infinity, ease: 'linear' }}
              />

              {!prefersReducedMotion && (
                <motion.circle
                  r="4.5"
                  fill="#7DD3FC"
                  cy="200"
                  animate={{ cx: [130, 484], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              <path d="M 526 164 C 526 105, 580 86, 636 86" stroke="#1E293B" strokeWidth="3" fill="none" />
              <motion.path
                key={`p3-${mode}`}
                d="M 526 164 C 526 105, 580 86, 636 86"
                stroke={mode === 'wifi' ? '#38BDF8' : '#0EA5E9'}
                strokeWidth={mode === 'wifi' ? '3.5' : '2'}
                fill="none"
                strokeDasharray="8 12"
                animate={prefersReducedMotion ? undefined : { strokeDashoffset: [0, -40] }}
                transition={{ duration: 1.45, repeat: Infinity, ease: 'linear' }}
              />

              <path d="M 566 200 L 636 200" stroke="#1E293B" strokeWidth="3" fill="none" />
              <motion.path
                key={`p4-${mode}`}
                d="M 566 200 L 636 200"
                stroke={mode === 'cctv' ? '#38BDF8' : '#0EA5E9'}
                strokeWidth={mode === 'cctv' ? '3.5' : '2'}
                fill="none"
                strokeDasharray="8 12"
                animate={prefersReducedMotion ? undefined : { strokeDashoffset: [0, -40] }}
                transition={{ duration: 1.25, repeat: Infinity, ease: 'linear' }}
              />

              <path d="M 526 236 C 526 295, 580 314, 636 314" stroke="#1E293B" strokeWidth="3" fill="none" />
              <motion.path
                key={`p5-${mode}`}
                d="M 526 236 C 526 295, 580 314, 636 314"
                stroke={mode === 'networking' ? '#38BDF8' : '#0EA5E9'}
                strokeWidth={mode === 'networking' ? '3.5' : '2'}
                fill="none"
                strokeDasharray="8 12"
                animate={prefersReducedMotion ? undefined : { strokeDashoffset: [0, -40] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
              />

              {!prefersReducedMotion && (
                <motion.circle
                  cx="318"
                  cy="200"
                  r="42"
                  stroke="#0EA5E9"
                  strokeWidth="1.5"
                  fill="none"
                  initial={{ opacity: 0.5, scale: 0.9 }}
                  animate={{ opacity: [0.5, 0], scale: [0.9, 1.35] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                  style={{ transformOrigin: '318px 200px' }}
                />
              )}

              {!prefersReducedMotion && (
                <motion.circle
                  key={`pulse-${mode}`}
                  cx="679"
                  cy={mode === 'wifi' ? 86 : mode === 'cctv' ? 200 : 314}
                  r="36"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  fill="none"
                  animate={{ opacity: [0.65, 0], scale: [0.85, 1.45] }}
                  transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut' }}
                  style={{
                    transformOrigin: `679px ${
                      mode === 'wifi' ? 86 : mode === 'cctv' ? 200 : 314
                    }px`,
                  }}
                />
              )}

              <g transform="translate(46, 164)">
                <rect width="80" height="72" rx="14" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
                <foreignObject x="24" y="14" width="32" height="32">
                  <div className="flex items-center justify-center w-8 h-8 text-sky-400">
                    <Globe className="w-6 h-6" />
                  </div>
                </foreignObject>
                <text x="40" y="58" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
                  {t.nodes.isp}
                </text>
              </g>

              <g transform="translate(278, 160)">
                <rect width="80" height="80" rx="16" fill="#0F172A" stroke="#0EA5E9" strokeWidth="2" />
                <foreignObject x="24" y="16" width="32" height="32">
                  <div className="flex items-center justify-center w-8 h-8 text-sky-400">
                    <Router className="w-6 h-6" />
                  </div>
                </foreignObject>
                <text x="40" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="600">
                  {t.nodes.router}
                </text>
              </g>

              <g transform="translate(486, 164)">
                <rect width="80" height="72" rx="14" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
                <foreignObject x="24" y="14" width="32" height="32">
                  <div className="flex items-center justify-center w-8 h-8 text-sky-300">
                    <Cpu className="w-6 h-6" />
                  </div>
                </foreignObject>
                <text x="40" y="58" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
                  {t.nodes.poe}
                </text>
              </g>

              <g transform="translate(636, 50)">
                <rect
                  width="86"
                  height="72"
                  rx="14"
                  fill={mode === 'wifi' ? '#0C4A6E' : '#0F172A'}
                  stroke={mode === 'wifi' ? '#38BDF8' : '#334155'}
                  strokeWidth="1.5"
                />
                <foreignObject x="27" y="14" width="32" height="32">
                  <div className="flex items-center justify-center w-8 h-8 text-sky-300">
                    <Wifi className="w-6 h-6" />
                  </div>
                </foreignObject>
                <text x="43" y="58" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
                  {t.nodes.wifi}
                </text>
              </g>

              <g transform="translate(636, 164)">
                <rect
                  width="86"
                  height="72"
                  rx="14"
                  fill={mode === 'cctv' ? '#0C4A6E' : '#0F172A'}
                  stroke={mode === 'cctv' ? '#38BDF8' : '#334155'}
                  strokeWidth="1.5"
                />
                <foreignObject x="27" y="14" width="32" height="32">
                  <div className="flex items-center justify-center w-8 h-8 text-sky-300">
                    <Cctv className="w-6 h-6" />
                  </div>
                </foreignObject>
                <text x="43" y="58" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
                  {t.nodes.cctv}
                </text>
              </g>

              <g transform="translate(636, 278)">
                <rect
                  width="86"
                  height="72"
                  rx="14"
                  fill={mode === 'networking' ? '#0C4A6E' : '#0F172A'}
                  stroke={mode === 'networking' ? '#38BDF8' : '#334155'}
                  strokeWidth="1.5"
                />
                <foreignObject x="27" y="14" width="32" height="32">
                  <div className="flex items-center justify-center w-8 h-8 text-sky-300">
                    {mode === 'cctv' ? (
                      <Smartphone className="w-6 h-6" />
                    ) : (
                      <HardDrive className="w-6 h-6" />
                    )}
                  </div>
                </foreignObject>
                <text x="43" y="58" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
                  {mode === 'cctv' ? t.nodes.mobile : t.nodes.lan}
                </text>
              </g>
            </svg>
          </div>

          {/* Mobile Vertical Animated SVG (< 640px) */}
          <div className="sm:hidden w-full flex items-center justify-center">
            <svg
              viewBox="0 0 340 420"
              className="w-full max-w-[300px] h-auto"
              role="img"
              aria-label={`Animated mobile workflow illustration for ${current.title}`}
            >
              <defs>
                <pattern
                  id="topo-dots-mobile"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="1.5" cy="1.5" r="1" fill="#1E293B" />
                </pattern>
                <linearGradient id="fiber-grad-v" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284C7" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
              </defs>

              <rect width="340" height="420" fill="url(#topo-dots-mobile)" rx="12" />

              <path d="M 170 84 L 170 132" stroke="#1E293B" strokeWidth="4" />
              <motion.path
                key={`mv1-${mode}`}
                d="M 170 84 L 170 132"
                stroke="url(#fiber-grad-v)"
                strokeWidth="3"
                strokeDasharray="8 10"
                animate={prefersReducedMotion ? undefined : { strokeDashoffset: [0, -36] }}
                transition={{ duration: 1.3, repeat: Infinity, ease: 'linear' }}
              />

              <path d="M 170 202 L 170 250" stroke="#1E293B" strokeWidth="4" />
              <motion.path
                key={`mv2-${mode}`}
                d="M 170 202 L 170 250"
                stroke="url(#fiber-grad-v)"
                strokeWidth="3"
                strokeDasharray="8 10"
                animate={prefersReducedMotion ? undefined : { strokeDashoffset: [0, -36] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              />

              {!prefersReducedMotion && (
                <motion.circle
                  cx="170"
                  r="4"
                  fill="#7DD3FC"
                  animate={{ cy: [86, 248], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              <path d="M 140 310 C 90 310, 62 325, 62 342" stroke="#1E293B" strokeWidth="3" fill="none" />
              <motion.path
                key={`mv3-${mode}`}
                d="M 140 310 C 90 310, 62 325, 62 342"
                stroke={mode === 'wifi' ? '#38BDF8' : '#0EA5E9'}
                strokeWidth={mode === 'wifi' ? '3.5' : '2'}
                fill="none"
                strokeDasharray="6 10"
                animate={prefersReducedMotion ? undefined : { strokeDashoffset: [0, -32] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
              />

              <path d="M 170 318 L 170 342" stroke="#1E293B" strokeWidth="3" fill="none" />
              <motion.path
                key={`mv4-${mode}`}
                d="M 170 318 L 170 342"
                stroke={mode === 'cctv' ? '#38BDF8' : '#0EA5E9'}
                strokeWidth={mode === 'cctv' ? '3.5' : '2'}
                fill="none"
                strokeDasharray="6 10"
                animate={prefersReducedMotion ? undefined : { strokeDashoffset: [0, -32] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              />

              <path d="M 200 310 C 250 310, 278 325, 278 342" stroke="#1E293B" strokeWidth="3" fill="none" />
              <motion.path
                key={`mv5-${mode}`}
                d="M 200 310 C 250 310, 278 325, 278 342"
                stroke={mode === 'networking' ? '#38BDF8' : '#0EA5E9'}
                strokeWidth={mode === 'networking' ? '3.5' : '2'}
                fill="none"
                strokeDasharray="6 10"
                animate={prefersReducedMotion ? undefined : { strokeDashoffset: [0, -32] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />

              {!prefersReducedMotion && (
                <motion.circle
                  cx="170"
                  cy="167"
                  r="36"
                  stroke="#0EA5E9"
                  strokeWidth="1.5"
                  fill="none"
                  animate={{ opacity: [0.55, 0], scale: [0.88, 1.32] }}
                  transition={{ duration: 2.1, repeat: Infinity, ease: 'easeOut' }}
                  style={{ transformOrigin: '170px 167px' }}
                />
              )}

              <g transform="translate(105, 18)">
                <rect width="130" height="66" rx="14" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
                <foreignObject x="16" y="18" width="28" height="28">
                  <div className="flex items-center justify-center w-7 h-7 text-sky-400">
                    <Globe className="w-5 h-5" />
                  </div>
                </foreignObject>
                <text x="52" y="38" fill="#E2E8F0" fontSize="13" fontWeight="600">
                  {t.nodes.isp}
                </text>
              </g>

              <g transform="translate(100, 132)">
                <rect width="140" height="70" rx="16" fill="#0F172A" stroke="#0EA5E9" strokeWidth="2" />
                <foreignObject x="16" y="21" width="28" height="28">
                  <div className="flex items-center justify-center w-7 h-7 text-sky-400">
                    <Router className="w-5 h-5" />
                  </div>
                </foreignObject>
                <text x="52" y="40" fill="#FFFFFF" fontSize="13" fontWeight="600">
                  {t.nodes.router}
                </text>
              </g>

              <g transform="translate(105, 250)">
                <rect width="130" height="68" rx="14" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
                <foreignObject x="16" y="20" width="28" height="28">
                  <div className="flex items-center justify-center w-7 h-7 text-sky-300">
                    <Cpu className="w-5 h-5" />
                  </div>
                </foreignObject>
                <text x="52" y="39" fill="#E2E8F0" fontSize="13" fontWeight="600">
                  {t.nodes.poe}
                </text>
              </g>

              <g transform="translate(16, 342)">
                <rect
                  width="92"
                  height="64"
                  rx="12"
                  fill={mode === 'wifi' ? '#0C4A6E' : '#0F172A'}
                  stroke={mode === 'wifi' ? '#38BDF8' : '#334155'}
                  strokeWidth="1.5"
                />
                <foreignObject x="32" y="10" width="28" height="28">
                  <div className="flex items-center justify-center w-7 h-7 text-sky-300">
                    <Wifi className="w-5 h-5" />
                  </div>
                </foreignObject>
                <text x="46" y="51" textAnchor="middle" fill="#E2E8F0" fontSize="11.5" fontWeight="600">
                  {t.nodes.wifi}
                </text>
              </g>

              <g transform="translate(124, 342)">
                <rect
                  width="92"
                  height="64"
                  rx="12"
                  fill={mode === 'cctv' ? '#0C4A6E' : '#0F172A'}
                  stroke={mode === 'cctv' ? '#38BDF8' : '#334155'}
                  strokeWidth="1.5"
                />
                <foreignObject x="32" y="10" width="28" height="28">
                  <div className="flex items-center justify-center w-7 h-7 text-sky-300">
                    <Cctv className="w-5 h-5" />
                  </div>
                </foreignObject>
                <text x="46" y="51" textAnchor="middle" fill="#E2E8F0" fontSize="11.5" fontWeight="600">
                  {t.nodes.cctv}
                </text>
              </g>

              <g transform="translate(232, 342)">
                <rect
                  width="92"
                  height="64"
                  rx="12"
                  fill={mode === 'networking' ? '#0C4A6E' : '#0F172A'}
                  stroke={mode === 'networking' ? '#38BDF8' : '#334155'}
                  strokeWidth="1.5"
                />
                <foreignObject x="32" y="10" width="28" height="28">
                  <div className="flex items-center justify-center w-7 h-7 text-sky-300">
                    {mode === 'cctv' ? (
                      <Smartphone className="w-5 h-5" />
                    ) : (
                      <HardDrive className="w-5 h-5" />
                    )}
                  </div>
                </foreignObject>
                <text x="46" y="51" textAnchor="middle" fill="#E2E8F0" fontSize="11.5" fontWeight="600">
                  {mode === 'cctv' ? t.nodes.mobile : t.nodes.lan}
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Right Spec Panel */}
        <div className="lg:col-span-4 p-4 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-s border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/80">
          <div className="space-y-3 sm:space-y-5">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                {t.flowLabel}
              </p>
              <p dir="ltr" className="font-mono text-[11px] sm:text-xs text-sky-700 dark:text-sky-300 leading-relaxed">
                {current.activeRoute}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {current.summary}
            </p>
          </div>

          <div className="mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2.5 sm:space-y-3">
            {current.specs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-center justify-between gap-3 text-xs sm:text-sm"
              >
                <span className="text-slate-600 dark:text-slate-400">{spec.label}</span>
                <span dir="ltr" className="font-mono font-medium text-slate-950 dark:text-white tabular-nums text-right">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
