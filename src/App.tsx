import React, { useState, useEffect, useRef } from 'react';
import { siteContent } from './content/siteContent';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WorkSection } from './components/WorkSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { AmbientBackground } from './components/AmbientBackground';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('df_portfolio_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  // Strictly sequential entrance cascade, one stage after another:
  // intro hero letters -> Work title -> both projects together -> About -> Footer.
  // Each stage becomes eligible only after the previous stage's animation has
  // finished, regardless of scroll position, so reveals never overlap.
  // Work entrance: title (0ms) + projects (300ms delay + 1100ms duration).
  const WORK_ANIMATION_MS = 1400;
  // Footer follows shortly after About starts fading in.
  const ABOUT_LEAD_MS = 1000;
  // Hero letter-by-letter entrance completes just before this fires.
  const HERO_ANIMATION_MS = 2850;

  // Deterministic top-to-bottom sequence gating:
  // 1-5: Header & Hero animate on mount
  // After hero letters finish, Work is eligible to reveal
  const [isHeroDone, setIsHeroDone] = useState(false);
  // After Work's entrance finishes, About becomes eligible to reveal
  const [isWorkRevealed, setIsWorkRevealed] = useState(false);
  // Shortly after About starts revealing, Footer reveals
  const [isAboutRevealed, setIsAboutRevealed] = useState(false);

  const workTimer = useRef<number | null>(null);
  const aboutTimer = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('df_portfolio_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.title = siteContent.meta.title;
  }, []);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    ) {
      setIsHeroDone(true);
      setIsWorkRevealed(true);
      setIsAboutRevealed(true);
      return;
    }

    // Hero strictly sequential letter-by-letter entrance completes smoothly
    const timer = window.setTimeout(() => {
      setIsHeroDone(true);
    }, HERO_ANIMATION_MS);

    return () => window.clearTimeout(timer);
  }, []);

  // Clear pending cascade timers on unmount
  useEffect(() => {
    return () => {
      if (workTimer.current !== null) window.clearTimeout(workTimer.current);
      if (aboutTimer.current !== null) window.clearTimeout(aboutTimer.current);
    };
  }, []);

  const isReducedMotion = () =>
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleWorkRevealed = () => {
    // About waits until both projects have finished appearing together.
    if (workTimer.current !== null) return;
    if (isReducedMotion()) {
      setIsWorkRevealed(true);
      return;
    }
    workTimer.current = window.setTimeout(() => {
      setIsWorkRevealed(true);
    }, WORK_ANIMATION_MS);
  };

  const handleAboutRevealed = () => {
    if (aboutTimer.current !== null) return;
    if (isReducedMotion()) {
      setIsAboutRevealed(true);
      return;
    }
    aboutTimer.current = window.setTimeout(() => {
      setIsAboutRevealed(true);
    }, ABOUT_LEAD_MS);
  };

  return (
    <div className="portfolio-app">
      {/* Calm base background for the page */}
      <AmbientBackground />

      {/* Accessible skip link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* 1. Global Minimal Header with icons-only social and email */}
      <Header
        ownerName={siteContent.ownerName}
        navigation={siteContent.navigation}
        social={siteContent.social}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Sections */}
      <main id="main-content" tabIndex={-1}>
        {/* 2-4: Hero (Hi, I'm David. -> Headline -> Subline) with living ambient background */}
        <Hero
          greeting={siteContent.hero.greeting}
          headline={siteContent.hero.headline}
          subline={siteContent.hero.subline}
        />

        {/* 6-7: Work Section (Heading -> both projects together) */}
        <WorkSection
          sectionTitle={siteContent.work.sectionTitle}
          projects={siteContent.work.projects}
          enabled={isHeroDone}
          onRevealed={handleWorkRevealed}
        />

        {/* 8-10: About Section (Heading -> Bio 1 -> Bio 2 with outside-of-class interests) */}
        <AboutSection
          sectionTitle={siteContent.about.sectionTitle}
          bio={siteContent.about.bio}
          enabled={isWorkRevealed}
          onRevealed={handleAboutRevealed}
        />
      </main>

      {/* 11. Minimal Footer */}
      <Footer
        copyright={siteContent.footer.copyright}
        isRevealed={isAboutRevealed}
      />
    </div>
  );
};

export default App;
