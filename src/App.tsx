import React, { useState, useEffect } from 'react';
import { siteContent } from './content/siteContent';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SelectedWork } from './components/SelectedWork';
import { CurrentFocus } from './components/CurrentFocus';
import { About } from './components/About';
import { OutsideSoftware } from './components/OutsideSoftware';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

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
      {/* Accessible skip link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Global Header */}
      <Header
        ownerName={siteContent.hero.name}
        navigation={siteContent.navigation}
        theme={theme}
        onToggleTheme={toggleTheme}
        githubUrl="https://github.com/Qtrick"
      />

      {/* Main Content Sections */}
      <main id="main-content" tabIndex={-1}>
        <Hero
          name={siteContent.hero.name}
          headline={siteContent.hero.headline}
          subheadline={siteContent.hero.subheadline}
          bioLine={siteContent.hero.bioLine}
          primaryCta={siteContent.hero.primaryCta}
          secondaryCta={siteContent.hero.secondaryCta}
        />

        <SelectedWork
          sectionTitle={siteContent.featuredProjects.sectionTitle}
          sectionEyebrow={siteContent.featuredProjects.sectionEyebrow}
          sectionDescription={siteContent.featuredProjects.sectionDescription}
          projects={siteContent.featuredProjects.items}
        />

        <CurrentFocus
          sectionTitle={siteContent.now.sectionTitle}
          sectionEyebrow={siteContent.now.sectionEyebrow}
          intro={siteContent.now.intro}
          focusList={siteContent.now.focusList}
        />

        <About
          sectionTitle={siteContent.about.sectionTitle}
          sectionEyebrow={siteContent.about.sectionEyebrow}
          paragraphs={siteContent.about.paragraphs}
        />

        <OutsideSoftware
          sectionTitle={siteContent.outside.sectionTitle}
          sectionEyebrow={siteContent.outside.sectionEyebrow}
          intro={siteContent.outside.intro}
          items={siteContent.outside.items}
        />

        <Contact
          sectionTitle={siteContent.contact.sectionTitle}
          sectionEyebrow={siteContent.contact.sectionEyebrow}
          headline={siteContent.contact.headline}
          body={siteContent.contact.body}
          email={siteContent.contact.email}
          socials={siteContent.contact.socials}
        />
      </main>

      {/* Global Footer */}
      <Footer
        ownerName={siteContent.hero.name}
        copyright="2026"
        links={siteContent.contact.socials}
      />
    </div>
  );
};

export default App;
