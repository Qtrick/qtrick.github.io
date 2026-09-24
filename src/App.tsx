import React, { useState, useEffect } from 'react';
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

  // Deterministic top-to-bottom sequence gating:
  // 1-5: Header & Hero animate on mount
  // After hero settles (~380ms), Work is eligible to reveal
  const [isHeroDone, setIsHeroDone] = useState(false);
  // When Work reveals, About becomes eligible to reveal
  const [isWorkRevealed, setIsWorkRevealed] = useState(false);
  // When About reveals, Footer reveals
  const [isAboutRevealed, setIsAboutRevealed] = useState(false);

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

    // Hero entrance completes in ~380ms (Name 80ms -> Headline 160ms -> Subline 240ms -> Links 320ms)
    const timer = setTimeout(() => {
      setIsHeroDone(true);
    }, 380);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleWorkRevealed = () => {
    setIsWorkRevealed(true);
  };

  const handleAboutRevealed = () => {
    setIsAboutRevealed(true);
  };

  return (
    <div className="portfolio-app">
      {/* Living Atmospheric Background */}
      <AmbientBackground />

      {/* Accessible skip link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* 1. Global Minimal Header */}
      <Header
        ownerName={siteContent.hero.name}
        navigation={siteContent.navigation}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Sections */}
      <main id="main-content" tabIndex={-1}>
        {/* 2-5: Hero (David Fan -> Headline -> Subline -> Links) */}
        <Hero
          name={siteContent.hero.name}
          headline={siteContent.hero.headline}
          subline={siteContent.hero.subline}
          links={siteContent.hero.links}
        />

        {/* 6-8: Work Section (Heading -> PreBase -> Coreside) */}
        <WorkSection
          sectionTitle={siteContent.work.sectionTitle}
          projects={siteContent.work.projects}
          enabled={isHeroDone}
          onRevealed={handleWorkRevealed}
        />

        {/* 9-11: About Section (Heading -> Bio -> Links/Email) */}
        <AboutSection
          sectionTitle={siteContent.about.sectionTitle}
          bio={siteContent.about.bio}
          email={siteContent.about.email}
          links={siteContent.about.links}
          enabled={isWorkRevealed}
          onRevealed={handleAboutRevealed}
        />
      </main>

      {/* 12. Minimal Footer */}
      <Footer
        copyright={siteContent.footer.copyright}
        isRevealed={isAboutRevealed}
      />
    </div>
  );
};

export default App;
