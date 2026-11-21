import { useEffect, useRef, useState } from 'react';
import { MotionConfig, motion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Globe,
  Languages,
  MapPin,
  Menu,
  Moon,
  Network,
  Phone,
  ShieldCheck,
  Sun,
  Tv,
  Wifi,
  Wrench,
  X,
} from 'lucide-react';
import { ResilientImage } from './components/ResilientImage';
import { AnimatedTopologyIllustration } from './components/AnimatedTopologyIllustration';
import { ThreeHardwareShowcase } from './components/ThreeHardwareShowcase';
import { PtclOffersHub } from './components/PtclOffersHub';
import { WhatsAppIcon } from './components/WhatsAppIcon';
import { Lang, Theme, TRANSLATIONS } from './i18n';

const HERO_IMAGE = '/src/assets/images/hero_network_datacenter_1795021570206.jpg';
const PORTRAIT_IMAGE = '/assets/aistudio/Internet_Engineer__Connecting_the_World_da06f7d4.png';
const CCTV_IMAGE = '/src/assets/images/service_cctv_cameras_1795021988626.jpg';
const WIRELESS_IMAGE = '/src/assets/images/service_wireless_campus_1795021571956.jpg';
const FIBER_IMAGE = '/src/assets/images/service_fiber_optics_1795021571817.jpg';
const WORKBENCH_IMAGE = '/src/assets/images/service_wifi_technician_1795021989595.jpg';

interface FormErrors {
  name?: string;
  phone?: string;
  location?: string;
}

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = window.localStorage.getItem('fk-lang');
    return saved === 'ur' ? 'ur' : 'en';
  } catch {
    return 'en';
  }
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = window.localStorage.getItem('fk-theme-v2');
    return saved === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export default function App() {
  const [lang, setLang] = useState<Lang>(getInitialLang);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    location: 'Mingora, Swat',
    serviceIndex: 0,
    details: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [serviceMenuOpen, setServiceMenuOpen] = useState(false);
  const serviceDropdownRef = useRef<HTMLDivElement | null>(null);

  const serviceIcons = [Camera, Wifi, Network, Wrench, Building2];
  const SelectedServiceIcon = serviceIcons[formState.serviceIndex] ?? Camera;

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (!serviceMenuOpen) return;
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (
        serviceDropdownRef.current &&
        !serviceDropdownRef.current.contains(event.target as Node)
      ) {
        setServiceMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setServiceMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [serviceMenuOpen]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.lang = lang;
    root.dir = lang === 'ur' ? 'rtl' : 'ltr';
    try {
      window.localStorage.setItem('fk-theme-v2', theme);
      window.localStorage.setItem('fk-lang', lang);
    } catch {
      // ignore storage errors in private frames
    }
  }, [lang, theme]);

  const handleLanguageChange = (nextLang: Lang) => {
    setLang(nextLang);
    setFormState((prev) => {
      if (nextLang === 'ur' && prev.location === 'Mingora, Swat') {
        return { ...prev, location: 'مینگورہ، سوات' };
      }
      if (nextLang === 'en' && prev.location === 'مینگورہ، سوات') {
        return { ...prev, location: 'Mingora, Swat' };
      }
      return prev;
    });
  };

  const handleBookPtclOffer = (packageSummary: string) => {
    setSubmitted(false);
    setFormState((prev) => ({
      ...prev,
      serviceIndex: 4,
      details:
        lang === 'ur'
          ? `منتخب پی ٹی سی ایل پیکج / آفر: ${packageSummary}`
          : `Selected PTCL Package / Offer: ${packageSummary}`,
    }));
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const selectedServiceLabel =
    t.contact.form.services[formState.serviceIndex] ?? t.contact.form.services[0];

  const whatsappSummaryUrl = `https://wa.me/923421229495?text=${encodeURIComponent(
    `Assalam-o-Alaikum Faizullah Khan, I need technician service.\nName: ${formState.name.trim()}\nPhone: ${formState.phone.trim()}\nLocation: ${formState.location.trim()}\nService: ${selectedServiceLabel}${
      formState.details.trim() ? `\nDetails: ${formState.details.trim()}` : ''
    }`
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: FormErrors = {};

    if (!formState.name.trim() || formState.name.trim().length < 2) {
      nextErrors.name = t.contact.form.nameError;
    }
    const digitsOnly = formState.phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      nextErrors.phone = t.contact.form.phoneError;
    }
    if (!formState.location.trim()) {
      nextErrors.location = t.contact.form.locationError;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);

    const anchor = document.createElement('a');
    anchor.href = whatsappSummaryUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const card0 = t.services.cards[0];
  const card1 = t.services.cards[1];
  const card2 = t.services.cards[2];
  const card3 = t.services.cards[3];

  return (
    <MotionConfig reducedMotion="user">
      <div
        id="top"
        className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden transition-colors duration-200"
      >
        {/* Top Bar Contract: 3 clean zones with integrated Language & Theme toggles */}
        <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4 lg:gap-6">
            <a
              href="#top"
              className="inline-flex items-center gap-1.5 sm:gap-2 font-display text-sm sm:text-xl font-bold tracking-tight text-slate-950 dark:text-white min-w-0 shrink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 rounded"
            >
              <svg
                viewBox="0 0 32 32"
                className="w-6 h-6 sm:w-7 sm:h-7 shrink-0"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="16" cy="16" r="13.5" stroke="#65B32E" strokeWidth="2.5" strokeDasharray="64 16" />
                <circle cx="16" cy="16" r="8.5" stroke="#007A33" strokeWidth="2.2" strokeDasharray="38 12" />
                <circle cx="16" cy="16" r="3.4" fill="#007A33" />
              </svg>
              <span className="truncate">{t.brand}</span>
            </a>

            <nav
              className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs xl:text-sm font-medium text-slate-600 dark:text-slate-300"
              aria-label="Primary navigation"
            >
              <a
                href="#ptcl-offers"
                className="hover:text-[#007A33] dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#007A33] dark:hover:border-emerald-400"
              >
                {t.nav.ptclOffers}
              </a>
              <a
                href="#hardware-3d"
                className="hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-sky-600 dark:hover:border-sky-400"
              >
                {t.nav.hardware3d}
              </a>
              <a
                href="#services"
                className="hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-sky-600 dark:hover:border-sky-400"
              >
                {t.nav.services}
              </a>
              <a
                href="#about"
                className="hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-sky-600 dark:hover:border-sky-400"
              >
                {t.nav.about}
              </a>
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Navbar Language Toggle: English | اردو */}
              <div
                className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                role="group"
                aria-label={t.controls.languageLabel}
              >
                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  aria-pressed={lang === 'en'}
                  className={`px-2 sm:px-2.5 py-1 min-h-[32px] sm:min-h-[34px] rounded-lg text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    lang === 'en'
                      ? 'bg-white dark:bg-sky-600 text-slate-950 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  <span className="sm:hidden">{t.controls.englishShort}</span>
                  <span className="hidden sm:inline">{t.controls.english}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('ur')}
                  aria-pressed={lang === 'ur'}
                  className={`px-2 sm:px-3 py-1 min-h-[32px] sm:min-h-[34px] rounded-lg text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    lang === 'ur'
                      ? 'bg-white dark:bg-sky-600 text-slate-950 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {t.controls.urdu}
                </button>
              </div>

              {/* Navbar Light / Dark Mode Button */}
              <button
                type="button"
                onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
                aria-label={t.controls.toggleTheme}
                aria-pressed={theme === 'dark'}
                title={theme === 'dark' ? t.controls.light : t.controls.dark}
                className="inline-flex items-center justify-center gap-1.5 w-9 h-9 sm:w-auto sm:h-10 sm:px-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="hidden md:inline text-xs font-semibold">
                      {t.controls.light}
                    </span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="hidden md:inline text-xs font-semibold">
                      {t.controls.dark}
                    </span>
                  </>
                )}
              </button>

              <a
                href="#contact"
                className="hidden sm:inline-flex items-center justify-center px-3.5 lg:px-4 h-10 rounded-xl bg-slate-950 dark:bg-sky-600 text-white text-xs lg:text-sm font-medium hover:bg-slate-800 dark:hover:bg-sky-500 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              >
                {t.nav.bookBtn}
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
                className="lg:hidden inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              >
                {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-2 shadow-xl">
              <div className="grid grid-cols-1 gap-1">
                <a
                  href="#ptcl-offers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center min-h-[46px] px-3.5 rounded-xl text-sm font-semibold text-[#007A33] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-900"
                >
                  {t.nav.mobilePtclOffers}
                </a>
                <a
                  href="#hardware-3d"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center min-h-[46px] px-3.5 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  {t.nav.mobileHardware3d}
                </a>
                <a
                  href="#services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center min-h-[46px] px-3.5 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  {t.nav.mobileServices}
                </a>
                <a
                  href="#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center min-h-[46px] px-3.5 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  {t.nav.mobileAbout}
                </a>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2.5">
                <div className="rounded-xl bg-slate-100 dark:bg-slate-900 p-2 border border-slate-200/80 dark:border-slate-800">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5 px-1">
                    <Languages className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>{t.controls.languageLabel}</span>
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => handleLanguageChange('en')}
                      className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        lang === 'en'
                          ? 'bg-white dark:bg-sky-600 text-slate-950 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {t.controls.englishShort}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLanguageChange('ur')}
                      className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        lang === 'ur'
                          ? 'bg-white dark:bg-sky-600 text-slate-950 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {t.controls.urdu}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-100 dark:bg-slate-900 p-2 border border-slate-200/80 dark:border-slate-800">
                  <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5 px-1">
                    {t.controls.themeLabel}
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`inline-flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        theme === 'light'
                          ? 'bg-white text-slate-950 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Sun className="w-3 h-3 text-amber-500" />
                      <span>{t.controls.light}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`inline-flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-slate-800 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Moon className="w-3 h-3 text-sky-400" />
                      <span>{t.controls.dark}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center min-h-[48px] px-4 rounded-xl text-sm font-semibold bg-slate-950 dark:bg-sky-600 text-white shadow-sm"
                >
                  {t.nav.bookBtn}
                </a>
              </div>
            </div>
          )}
        </header>

        <main className="flex-1">
          {/* 1. MODERN PTCL & NETWORKING HERO SECTION */}
          <section className="relative pt-4 pb-8 sm:pt-14 sm:pb-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 overflow-hidden transition-colors">
            {/* PTCL Signature Top Accent Line */}
            <div
              className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0B2241] via-[#007A33] to-[#65B32E]"
              aria-hidden="true"
            />
            {/* Subtle Architectural Grid + PTCL Emerald Glow */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.45] dark:opacity-[0.22]"
              style={{
                backgroundImage:
                  theme === 'dark'
                    ? 'linear-gradient(to right, rgba(16,185,129,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.12) 1px, transparent 1px)'
                    : 'linear-gradient(to right, rgba(0,122,51,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,122,51,0.045) 1px, transparent 1px)',
                backgroundSize: '56px 56px',
              }}
              aria-hidden="true"
            />

            <div className="relative max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-10 lg:gap-12 items-center">
                {/* Mobile First (Top) / Desktop Right: Faizullah Khan Official Portrait */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="order-1 lg:order-2 lg:col-span-6 flex items-center justify-center"
                >
                  <div className="w-[95%] sm:w-full sm:max-w-[440px] lg:max-w-[520px] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-emerald-500/40 dark:border-emerald-500/50 bg-[#0B2241] shadow-xl sm:shadow-2xl flex flex-col">
                    <div
                      className="h-1.5 w-full bg-gradient-to-r from-[#007A33] via-[#65B32E] to-[#0EA5E9]"
                      aria-hidden="true"
                    />
                    <div className="w-full aspect-square bg-sky-100 dark:bg-slate-900 overflow-hidden">
                      <ResilientImage
                        src={PORTRAIT_IMAGE}
                        alt="Faizullah Khan — Internet & Networking Engineer"
                        fallbackTitle="Faizullah Khan — Internet Engineer"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="px-3 py-2 sm:px-6 sm:py-4 bg-gradient-to-r from-[#0B2241] via-[#0F2D54] to-[#083828] flex items-center justify-between gap-2 text-white border-t border-emerald-500/30">
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs font-semibold tracking-wide text-[#86EFAC] truncate">
                          {t.hero.imageTag}
                        </p>
                        <p className="font-display text-xs sm:text-base font-semibold tracking-tight mt-0.5 truncate">
                          {t.hero.imageTitle}
                        </p>
                      </div>
                      <div
                        className="inline-flex items-center gap-1.5 rounded-lg sm:rounded-xl bg-white/10 px-2 py-1 sm:px-2.5 sm:py-1.5 border border-white/15 text-[10px] sm:text-xs font-mono font-semibold text-white shrink-0"
                        dir="ltr"
                      >
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#65B32E]" aria-hidden="true" />
                        <span>0342-1229495</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Mobile Second (Below Image) / Desktop Left: Headline, Highlights & Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="order-2 lg:order-1 lg:col-span-6 flex flex-col justify-center py-0.5 sm:py-2"
                >
                  <p className="text-[10.5px] sm:text-sm font-semibold tracking-wide text-[#007A33] dark:text-emerald-400 mb-1.5 sm:mb-3">
                    {t.hero.kicker}
                  </p>

                  <h1
                    className="font-display font-bold tracking-[-0.03em] text-slate-950 dark:text-white text-balance leading-[1.15]"
                    style={{ fontSize: 'clamp(1.4rem, 4.1vw, 3.6rem)' }}
                  >
                    {t.hero.title}
                  </h1>

                  <p className="mt-2 sm:mt-5 text-xs sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                    {t.hero.description}
                  </p>

                  {/* 4 PTCL Core Services Strip (Compact on Mobile) */}
                  <div className="mt-3 sm:mt-5 grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 max-w-xl">
                    {[
                      { label: t.hero.ptclHighlights[0], Icon: Wifi },
                      { label: t.hero.ptclHighlights[1], Icon: Globe },
                      { label: t.hero.ptclHighlights[2], Icon: Phone },
                      { label: t.hero.ptclHighlights[3], Icon: Tv },
                    ].map(({ label, Icon }) => (
                      <div
                        key={label}
                        className="flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-emerald-50/75 dark:bg-emerald-950/35 border border-emerald-200/80 dark:border-emerald-800/60 px-2 py-1 sm:px-2.5 sm:py-2 text-[10.5px] sm:text-xs font-semibold text-[#0B2241] dark:text-emerald-200"
                      >
                        <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#007A33] dark:text-emerald-400 shrink-0" />
                        <span className="truncate">{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Primary & Card CTA Buttons (Compact Height on Mobile) */}
                  <div className="mt-2.5 sm:mt-7 grid grid-cols-2 sm:flex sm:flex-wrap items-stretch sm:items-center gap-1.5 sm:gap-4">
                    <a
                      href="#contact"
                      className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-6 py-1.5 sm:py-3.5 min-h-[38px] sm:min-h-[48px] rounded-lg sm:rounded-xl bg-[#007A33] hover:bg-[#00662A] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-[11px] sm:text-sm font-semibold transition-colors shadow-sm whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                    >
                      <span className="truncate">{t.hero.ctaPrimary}</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 rtl:rotate-180 shrink-0" />
                    </a>

                    <a
                      href="#ptcl-offers"
                      className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-5 py-1.5 sm:py-3.5 min-h-[38px] sm:min-h-[48px] rounded-lg sm:rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-[11px] sm:text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                    >
                      <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-[#007A33] dark:text-emerald-400 shrink-0" />
                      <span className="truncate">{t.hero.ctaSecondary}</span>
                    </a>
                  </div>

                  <div className="mt-3.5 sm:mt-8 pt-3 sm:pt-6 border-t border-slate-200/80 dark:border-slate-800">
                    <div className="rounded-xl sm:rounded-none bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-2.5 py-2 sm:p-0 sm:bg-transparent sm:dark:bg-transparent sm:border-0 flex flex-wrap items-center justify-between sm:justify-start gap-x-3 gap-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      <div className="inline-flex items-center gap-1.5 sm:gap-2" dir="ltr">
                        <a
                          href="tel:03421229495"
                          className="font-mono font-semibold text-xs sm:text-base text-slate-950 dark:text-white hover:text-[#007A33] dark:hover:text-emerald-400 transition-colors tabular-nums"
                        >
                          0342-1229495
                        </a>
                        <a
                          href="tel:03421229495"
                          aria-label="Call 0342-1229495 in dialer"
                          title="Call 0342-1229495"
                          className="inline-flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-600 dark:hover:text-white transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </a>
                        <a
                          href="https://wa.me/923421229495"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="WhatsApp 0342-1229495"
                          title="WhatsApp 0342-1229495"
                          className="inline-flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#25D366] text-white hover:bg-[#1EBE5D] shadow-xs transition-colors"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </a>
                      </div>
                      <span className="hidden sm:inline text-slate-300 dark:text-slate-700" aria-hidden="true">
                        ·
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] sm:text-sm">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#007A33] dark:text-emerald-400" />
                        <span>{t.hero.location}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Full-Width 4-Column Capabilities Strip */}
              <div className="mt-4 sm:mt-14 pt-4 sm:pt-8 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 lg:gap-8">
                {t.hero.metrics.map((item) => (
                  <div
                    key={item.value}
                    className="rounded-lg sm:rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 p-2.5 sm:p-0 sm:bg-transparent sm:dark:bg-transparent sm:border-0"
                  >
                    <p
                      dir="ltr"
                      className="font-display text-base sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white font-mono tabular-nums rtl:text-right"
                    >
                      {item.value}
                    </p>
                    <p className="mt-0.5 sm:mt-1 text-[10.5px] sm:text-sm text-slate-600 dark:text-slate-400 leading-snug">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 2. PTCL SERVICES, TARIFFS & SPECIAL OFFERS HUB */}
          <section
            id="ptcl-offers"
            className="py-10 sm:py-20 bg-slate-50 dark:bg-slate-900/55 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors"
          >
            <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
              <PtclOffersHub lang={lang} onBookPackage={handleBookPtclOffer} />
            </div>
          </section>

          {/* 3. INTERACTIVE 3D HARDWARE STUDIO */}
          <section
            id="hardware-3d"
            className="py-10 sm:py-20 bg-slate-100 dark:bg-slate-900/50 text-slate-950 dark:text-white border-b border-slate-200/80 dark:border-slate-800/80 transition-colors"
          >
            <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-5 sm:space-y-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
                <div className="max-w-2xl">
                  <p className="text-[11px] sm:text-xs font-semibold tracking-wide text-sky-700 dark:text-sky-400 mb-1.5 sm:mb-2">
                    {t.hardware3d.kicker}
                  </p>
                  <h2 className="font-display text-xl sm:text-4xl font-bold tracking-[-0.02em] text-slate-950 dark:text-white text-balance">
                    {t.hardware3d.title}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm">
                  {t.hardware3d.hint}
                </p>
              </div>

              <ThreeHardwareShowcase lang={lang} theme={theme} />
            </div>
          </section>

          {/* 5. ANIMATED WORKFLOW ILLUSTRATION & MODERN BENTO SERVICES */}
          <section
            id="architecture"
            className="py-10 sm:py-20 bg-white dark:bg-slate-950 transition-colors"
          >
            <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-8 sm:space-y-14">
              <div className="max-w-2xl">
                <p className="text-[11px] sm:text-xs font-semibold tracking-wide text-sky-700 dark:text-sky-400 mb-1.5 sm:mb-2">
                  {t.topology.sectionKicker}
                </p>
                <h2 className="font-display text-xl sm:text-4xl font-bold tracking-[-0.02em] text-slate-950 dark:text-white text-balance">
                  {t.topology.sectionTitle}
                </h2>
                <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  {t.topology.sectionDesc}
                </p>
              </div>

              <AnimatedTopologyIllustration lang={lang} />

              {/* Core Technician Services Bento Grid */}
              <div id="services" className="pt-2 sm:pt-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-sky-700 dark:text-sky-400 mb-1.5">
                      {t.services.kicker}
                    </p>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                      {t.services.title}
                    </h2>
                  </div>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 whitespace-nowrap shrink-0 min-h-[40px]"
                  >
                    <span>{t.services.cta}</span>
                    <ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" />
                  </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Card 01: Wide Span - CCTV Security Cameras */}
                  <motion.article
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.4 }}
                    className="group lg:col-span-2 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 overflow-hidden grid grid-cols-1 md:grid-cols-2 items-stretch hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="p-4 sm:p-8 flex flex-col justify-between order-2 md:order-1">
                      <div>
                        <p className="text-xs font-mono font-semibold text-sky-700 dark:text-sky-400 mb-1.5 sm:mb-2">
                          {card0.index}
                        </p>
                        <h3 className="font-display text-base sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                          {card0.title}
                        </h3>
                        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {card0.desc}
                        </p>
                      </div>
                      {'footer' in card0 && (
                        <p
                          dir="ltr"
                          className="mt-3.5 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 rtl:text-right"
                        >
                          {card0.footer}
                        </p>
                      )}
                    </div>
                    <div className="aspect-[16/9] sm:aspect-[4/3] md:aspect-auto md:min-h-full bg-slate-900 overflow-hidden order-1 md:order-2">
                      <ResilientImage
                        src={CCTV_IMAGE}
                        alt="Outdoor white IP dome and bullet CCTV security cameras neatly mounted with conduit wiring"
                        fallbackTitle="CCTV Camera Installation"
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  </motion.article>

                  {/* Card 02: Wi-Fi & Wireless Setup */}
                  <motion.article
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    className="group rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 overflow-hidden flex flex-col hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="aspect-[16/9] sm:aspect-[4/3] bg-slate-900 overflow-hidden">
                      <ResilientImage
                        src={WIRELESS_IMAGE}
                        alt="Ceiling-mounted enterprise Wi-Fi access point inside a modern commercial building"
                        fallbackTitle="Wi-Fi & Wireless Coverage"
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-mono font-semibold text-sky-700 dark:text-sky-400 mb-1.5 sm:mb-2">
                          {card1.index}
                        </p>
                        <h3 className="font-display text-base sm:text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                          {card1.title}
                        </h3>
                        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {card1.desc}
                        </p>
                      </div>
                    </div>
                  </motion.article>

                  {/* Card 03: Fiber Optic & LAN Networking */}
                  <motion.article
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.4, delay: 0.08 }}
                    className="group rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 overflow-hidden flex flex-col hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="aspect-[16/9] sm:aspect-[4/3] bg-slate-900 overflow-hidden">
                      <ResilientImage
                        src={FIBER_IMAGE}
                        alt="Precision fiber-optic patch cables connected to a managed gigabit switch"
                        fallbackTitle="Fiber & LAN Switching"
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-mono font-semibold text-sky-700 dark:text-sky-400 mb-1.5 sm:mb-2">
                          {card2.index}
                        </p>
                        <h3 className="font-display text-base sm:text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                          {card2.title}
                        </h3>
                        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {card2.desc}
                        </p>
                      </div>
                    </div>
                  </motion.article>

                  {/* Card 04: Wide Span - Technician Workbench, Router Setup & Repair */}
                  <motion.article
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="group lg:col-span-2 rounded-2xl sm:rounded-3xl border border-slate-800 dark:border-slate-700/80 bg-slate-950 dark:bg-slate-900 text-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-2 items-stretch"
                  >
                    <div className="p-4 sm:p-8 flex flex-col justify-between order-2 md:order-1">
                      <div>
                        <p className="text-xs font-mono font-semibold text-sky-400 mb-1.5 sm:mb-2">
                          {card3.index}
                        </p>
                        <h3 className="font-display text-lg sm:text-2xl font-bold tracking-tight text-white">
                          {card3.title}
                        </h3>
                        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {card3.desc}
                        </p>
                        {'bullets' in card3 && (
                          <div className="mt-4 sm:mt-5 space-y-2">
                            {card3.bullets.map((bullet) => (
                              <div
                                key={bullet}
                                className="flex items-start gap-2 text-xs sm:text-sm text-slate-200"
                              >
                                <ShieldCheck className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                                <span>{bullet}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="aspect-[16/9] sm:aspect-[4/3] md:aspect-auto md:min-h-full bg-slate-900 overflow-hidden order-1 md:order-2">
                      <ResilientImage
                        src={WORKBENCH_IMAGE}
                        alt="Technician hands testing Cat6 Ethernet cable and configuring a dual-band Wi-Fi router"
                        fallbackTitle="Router Config & Cable Diagnostics"
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  </motion.article>
                </div>
              </div>
            </div>
          </section>

          {/* 5. ABOUT TECHNICIAN & PROOF OF WORK */}
          <section
            id="about"
            className="py-10 sm:py-20 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200/80 dark:border-slate-800/80 transition-colors"
          >
            <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-12 items-stretch">
                <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-lg aspect-[16/10] sm:aspect-[4/5] lg:aspect-auto lg:min-h-[400px]">
                  <ResilientImage
                    src={HERO_IMAGE}
                    alt="Structured network server rack and PTCL fiber installation by Faizullah Khan"
                    fallbackTitle="Complete Networking & Server Racks"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="lg:col-span-7 flex flex-col justify-between py-0.5 sm:py-1">
                  <div>
                    <p className="text-[11px] sm:text-xs font-semibold tracking-wide text-sky-700 dark:text-sky-400 mb-1.5 sm:mb-2">
                      {t.about.kicker}
                    </p>
                    <h2 className="font-display text-xl sm:text-4xl font-bold tracking-[-0.02em] text-slate-950 dark:text-white text-balance">
                      {t.about.title}
                    </h2>
                    <p className="mt-3 sm:mt-4 text-xs sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      {t.about.bio}
                    </p>
                  </div>

                  <div className="mt-6 sm:mt-8 pt-5 sm:pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4 sm:space-y-6">
                    <h3 className="font-display text-sm font-semibold text-slate-950 dark:text-white">
                      {t.about.recentHeading}
                    </h3>
                    <div className="space-y-4 sm:space-y-5">
                      {t.about.proofs.map((proof) => (
                        <div
                          key={proof.title}
                          className="pb-4 sm:pb-5 border-b border-slate-200/80 dark:border-slate-800 last:border-b-0 last:pb-0"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                            <h4 className="font-display text-sm sm:text-base font-semibold text-slate-950 dark:text-white">
                              {proof.title}
                            </h4>
                            <span className="font-mono text-xs font-medium text-sky-700 dark:text-sky-400 shrink-0 tabular-nums">
                              {proof.metric}
                            </span>
                          </div>
                          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {proof.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. INTERACTIVE CONSULTATION & BOOKING FORM */}
          <section
            id="contact"
            className="py-10 sm:py-20 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-t border-slate-200/80 dark:border-slate-800/80 transition-colors"
          >
            <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-12 items-start">
                <div className="lg:col-span-5 space-y-5 sm:space-y-6">
                  <div>
                    <p className="text-[11px] sm:text-xs font-semibold tracking-wide text-sky-700 dark:text-sky-400 mb-1.5 sm:mb-2">
                      {t.contact.kicker}
                    </p>
                    <h2 className="font-display text-xl sm:text-4xl font-bold tracking-[-0.02em] text-slate-950 dark:text-white text-balance">
                      {t.contact.title}
                    </h2>
                    <p className="mt-2.5 sm:mt-4 text-slate-600 dark:text-slate-300 text-xs sm:text-base leading-relaxed">
                      {t.contact.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-300/80 dark:border-slate-800 space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">
                          {t.contact.phoneLabel}
                        </p>
                        <div className="mt-1 inline-flex items-center gap-2.5" dir="ltr">
                          <a
                            href="tel:03421229495"
                            className="font-mono text-base sm:text-lg font-semibold text-slate-950 dark:text-white hover:text-sky-700 dark:hover:text-sky-300 transition-colors tabular-nums"
                          >
                            0342-1229495
                          </a>
                          <a
                            href="tel:03421229495"
                            aria-label="Call 0342-1229495 in dialer"
                            title="Call 0342-1229495"
                            className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-600 dark:hover:text-white transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                          <a
                            href="https://wa.me/923421229495"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp 0342-1229495"
                            title="WhatsApp 0342-1229495"
                            className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#25D366] text-white hover:bg-[#1EBE5D] shadow-xs transition-colors"
                          >
                            <WhatsAppIcon className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">
                          {t.contact.areaLabel}
                        </p>
                        <p className="text-sm sm:text-base font-medium text-slate-950 dark:text-white">
                          {t.contact.areaValue}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-lg sm:shadow-xl dark:shadow-2xl">
                    {submitted ? (
                      <div className="py-6 sm:py-8 text-center space-y-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto bg-emerald-50 dark:bg-emerald-950/60 text-[#25D366]">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                          {t.contact.form.successTitle}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                          {t.contact.form.successDesc1}{' '}
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {formState.name}
                          </span>
                          {t.contact.form.successDesc2}{' '}
                          <span dir="ltr" className="font-mono font-medium">
                            0342-1229495
                          </span>{' '}
                          {t.contact.form.successDesc3}
                        </p>
                        <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
                          <a
                            href={whatsappSummaryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[46px] rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#1EBE5D] hover:to-[#0F766E] text-white text-sm font-semibold shadow-sm transition-all"
                          >
                            <WhatsAppIcon className="w-4 h-4 shrink-0" />
                            <span>{t.contact.form.sendWhatsapp}</span>
                            <ArrowRight className="w-4 h-4 rtl:rotate-180 shrink-0" />
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              setSubmitted(false);
                              setFormState((prev) => ({
                                ...prev,
                                name: '',
                                phone: '',
                                details: '',
                              }));
                            }}
                            className="px-4 py-2.5 min-h-[46px] rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            {t.contact.form.editBtn}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                          <div>
                            <label
                              htmlFor="contact-name"
                              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                            >
                              {t.contact.form.nameLabel}
                            </label>
                            <input
                              id="contact-name"
                              type="text"
                              value={formState.name}
                              onChange={(e) =>
                                setFormState((prev) => ({ ...prev, name: e.target.value }))
                              }
                              placeholder={t.contact.form.namePlaceholder}
                              className="w-full px-3.5 py-2.5 min-h-[46px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-base sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/75 focus:border-emerald-500 transition-colors"
                            />
                            {errors.name && (
                              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                                {errors.name}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="contact-phone"
                              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                            >
                              {t.contact.form.phoneLabel}
                            </label>
                            <input
                              id="contact-phone"
                              type="tel"
                              dir="ltr"
                              value={formState.phone}
                              onChange={(e) =>
                                setFormState((prev) => ({ ...prev, phone: e.target.value }))
                              }
                              placeholder={t.contact.form.phonePlaceholder}
                              className="w-full px-3.5 py-2.5 min-h-[46px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-base sm:text-sm font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/75 focus:border-emerald-500 transition-colors"
                            />
                            {errors.phone && (
                              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                                {errors.phone}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                          <div>
                            <label
                              htmlFor="contact-location"
                              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                            >
                              {t.contact.form.locationLabel}
                            </label>
                            <input
                              id="contact-location"
                              type="text"
                              value={formState.location}
                              onChange={(e) =>
                                setFormState((prev) => ({ ...prev, location: e.target.value }))
                              }
                              placeholder={t.contact.form.locationPlaceholder}
                              className="w-full px-3.5 py-2.5 min-h-[46px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-base sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/75 focus:border-emerald-500 transition-colors"
                            />
                            {errors.location && (
                              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                                {errors.location}
                              </p>
                            )}
                          </div>

                          <div ref={serviceDropdownRef} className="relative">
                            <label
                              id="contact-service-label"
                              htmlFor="contact-service"
                              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                            >
                              {t.contact.form.serviceLabel}
                            </label>
                            <button
                              id="contact-service"
                              type="button"
                              aria-haspopup="listbox"
                              aria-expanded={serviceMenuOpen}
                              aria-labelledby="contact-service-label contact-service"
                              onClick={() => setServiceMenuOpen((prev) => !prev)}
                              className={`w-full px-3 py-2 min-h-[46px] rounded-xl border text-base sm:text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 flex items-center justify-between gap-2.5 transition-all cursor-pointer focus:outline-none ${
                                serviceMenuOpen
                                  ? 'border-emerald-500 ring-2 ring-emerald-500/35'
                                  : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/35'
                              }`}
                            >
                              <span className="flex items-center gap-2.5 min-w-0">
                                <span className="w-7 h-7 rounded-lg bg-emerald-500/12 dark:bg-emerald-500/15 text-[#007A33] dark:text-emerald-400 flex items-center justify-center shrink-0">
                                  <SelectedServiceIcon className="w-3.5 h-3.5" />
                                </span>
                                <span className="truncate font-medium text-start">
                                  {selectedServiceLabel}
                                </span>
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-200 ${
                                  serviceMenuOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
                                }`}
                              />
                            </button>

                            {serviceMenuOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.16 }}
                                role="listbox"
                                aria-labelledby="contact-service-label"
                                className="absolute inset-x-0 top-full mt-2 z-50 rounded-2xl border border-slate-200 dark:border-slate-700/90 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-950/15 dark:shadow-black/70 p-1.5 space-y-1 max-h-72 overflow-y-auto"
                              >
                                {t.contact.form.services.map((serviceLabel, index) => {
                                  const OptionIcon = serviceIcons[index] ?? Camera;
                                  const isSelected = formState.serviceIndex === index;
                                  return (
                                    <button
                                      key={serviceLabel}
                                      type="button"
                                      role="option"
                                      aria-selected={isSelected}
                                      onClick={() => {
                                        setFormState((prev) => ({
                                          ...prev,
                                          serviceIndex: index,
                                        }));
                                        setServiceMenuOpen(false);
                                      }}
                                      className={`w-full flex items-center justify-between gap-2.5 px-2.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                                        isSelected
                                          ? 'bg-emerald-50 dark:bg-emerald-500/15 text-[#007A33] dark:text-emerald-300'
                                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                                      }`}
                                    >
                                      <span className="flex items-center gap-2.5 min-w-0">
                                        <span
                                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                            isSelected
                                              ? 'bg-[#007A33] dark:bg-emerald-500 text-white'
                                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                          }`}
                                        >
                                          <OptionIcon className="w-3.5 h-3.5" />
                                        </span>
                                        <span className="text-start leading-snug">
                                          {serviceLabel}
                                        </span>
                                      </span>
                                      {isSelected && (
                                        <Check className="w-4 h-4 text-[#007A33] dark:text-emerald-400 shrink-0" />
                                      )}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="contact-details"
                            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                          >
                            {t.contact.form.detailsLabel}
                          </label>
                          <textarea
                            id="contact-details"
                            rows={3}
                            value={formState.details}
                            onChange={(e) =>
                              setFormState((prev) => ({ ...prev, details: e.target.value }))
                            }
                            placeholder={t.contact.form.detailsPlaceholder}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-base sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/75 focus:border-emerald-500 transition-colors"
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#1EBE5D] hover:to-[#0F766E] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] w-full sm:w-auto"
                          >
                            <WhatsAppIcon className="w-4 h-4 shrink-0" />
                            <span>{t.contact.form.submitBtn}</span>
                            <ArrowRight className="w-4 h-4 rtl:rotate-180 shrink-0" />
                          </button>

                          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 py-1">
                            <span>{t.contact.form.orCall}</span>
                            <div className="inline-flex items-center gap-2" dir="ltr">
                              <a
                                href="tel:03421229495"
                                className="font-mono font-semibold text-slate-900 dark:text-white hover:text-sky-700 dark:hover:text-sky-400"
                              >
                                0342-1229495
                              </a>
                              <a
                                href="tel:03421229495"
                                aria-label="Call 0342-1229495 in dialer"
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 hover:bg-sky-600 hover:text-white transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href="https://wa.me/923421229495"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp 0342-1229495"
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#25D366] text-white hover:bg-[#1EBE5D] shadow-xs transition-colors"
                              >
                                <WhatsAppIcon className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Quiet Footer */}
        <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-400 border-t border-slate-800 dark:border-slate-900 pt-10 pb-24 md:pb-10 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="font-display text-base font-bold text-white">
                {t.brand}
              </p>
              <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                <span>{t.footer.roleLine}</span>
                <span aria-hidden="true">·</span>
                <div className="inline-flex items-center gap-2" dir="ltr">
                  <a
                    href="tel:03421229495"
                    className="font-mono text-slate-200 hover:text-white transition-colors"
                  >
                    0342-1229495
                  </a>
                  <a
                    href="tel:03421229495"
                    aria-label="Call 0342-1229495 in dialer"
                    className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 text-sky-400 hover:bg-sky-600 hover:text-white transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://wa.me/923421229495"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp 0342-1229495"
                    className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#25D366] text-white hover:bg-[#1EBE5D] transition-colors"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium">
              <a href="#ptcl-offers" className="py-2 text-emerald-400 hover:text-emerald-300 transition-colors">
                {t.footer.links.ptclOffers}
              </a>
              <a href="#hardware-3d" className="py-2 hover:text-white transition-colors">
                {t.footer.links.hardware}
              </a>
              <a href="#architecture" className="py-2 hover:text-white transition-colors">
                {t.footer.links.workflow}
              </a>
              <a href="#services" className="py-2 hover:text-white transition-colors">
                {t.footer.links.services}
              </a>
              <a href="#contact" className="py-2 hover:text-white transition-colors">
                {t.footer.links.contact}
              </a>
            </div>
          </div>
        </footer>

        {/* Mobile Thumb Quick-Action Bar */}
        <div className="md:hidden fixed bottom-2.5 inset-x-3 z-30">
          <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/80 shadow-2xl">
            <a
              href="tel:03421229495"
              className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
              <span className="truncate">{t.controls.mobileCall}</span>
            </a>
            <a
              href="https://wa.me/923421229495"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#1EBE5D] hover:to-[#0F766E] text-white text-xs font-semibold shadow-sm transition-all"
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.controls.mobileWhatsapp}</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-2 rounded-xl bg-[#0B2241] dark:bg-sky-600 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-sky-500 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{t.controls.mobileBook}</span>
            </a>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
