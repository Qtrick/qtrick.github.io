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
    // Default to warm off-white editorial theme
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('df_portfolio_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.title = siteContent.meta.title;
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="portfolio-app">
      {/* Subtle ambient atmospheric background */}
      <AmbientBackground />

      {/* Accessible skip link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Global Minimal Header */}
      <Header
        ownerName={siteContent.hero.name}
        navigation={siteContent.navigation}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Sections */}
      <main id="main-content" tabIndex={-1}>
        <Hero
          name={siteContent.hero.name}
          headline={siteContent.hero.headline}
          subline={siteContent.hero.subline}
          links={siteContent.hero.links}
        />

        <WorkSection
          sectionTitle={siteContent.work.sectionTitle}
          projects={siteContent.work.projects}
        />

        <AboutSection
          sectionTitle={siteContent.about.sectionTitle}
          bio={siteContent.about.bio}
          email={siteContent.about.email}
          links={siteContent.about.links}
        />
      </main>

      {/* Minimal Footer */}
      <Footer copyright={siteContent.footer.copyright} />
    </div>
  );
};

export default App;
