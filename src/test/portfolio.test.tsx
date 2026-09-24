import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import App from '../App';
import { siteContent } from '../content/siteContent';

describe('David Fan Portfolio Site', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Global Navigation & Social Links', () => {
    it('renders global GitHub and LinkedIn as brand icons without redundant text labels', () => {
      render(<App />);

      // GitHub icon link in header
      const githubLink = screen.getByRole('link', {
        name: /GitHub profile/i,
      });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute('href', 'https://github.com/Qtrick');
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');

      // LinkedIn icon link in header
      const linkedInLink = screen.getByRole('link', {
        name: /LinkedIn profile/i,
      });
      expect(linkedInLink).toBeInTheDocument();
      expect(linkedInLink).toHaveAttribute(
        'href',
        'https://www.linkedin.com/in/david-fan-3a5a66313/'
      );
      expect(linkedInLink).toHaveAttribute('target', '_blank');
      expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer');

      // Ensure NO text "GitHub ↗" or "LinkedIn ↗" anywhere in the document
      expect(screen.queryByText(/GitHub ↗/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/LinkedIn ↗/i)).not.toBeInTheDocument();

      // Only 1 global personal GitHub link and 1 global personal LinkedIn link
      const allPersonalGitHub = screen.getAllByRole('link', {
        name: /GitHub profile/i,
      });
      expect(allPersonalGitHub).toHaveLength(1);

      const allLinkedIn = screen.getAllByRole('link', {
        name: /LinkedIn profile/i,
      });
      expect(allLinkedIn).toHaveLength(1);
    });

    it('renders primary navigation items Work and About', () => {
      render(<App />);
      expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute(
        'href',
        '#work'
      );
      expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
        'href',
        '#about'
      );
    });
  });

  describe('Email in Header Menu Bar', () => {
    it('displays Email: dfan@umass.edu with mailto link and copy button', () => {
      render(<App />);

      // The label "Email:" must be explicitly rendered
      expect(screen.getByText('Email:')).toBeInTheDocument();

      // Email link uses mailto:dfan@umass.edu
      const emailLink = screen.getByRole('link', {
        name: /Send email to dfan@umass\.edu/i,
      });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveTextContent('dfan@umass.edu');
      expect(emailLink).toHaveAttribute('href', 'mailto:dfan@umass.edu');

      // UI does NOT display raw markdown syntax
      expect(
        screen.queryByText(/\[ dfan@umass\.edu \]\(mailto:dfan@umass\.edu\)/i)
      ).not.toBeInTheDocument();
    });

    it('copies only dfan@umass.edu and gives visual feedback', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      render(<App />);

      const copyBtn = screen.getByRole('button', {
        name: /Copy email address to clipboard/i,
      });
      expect(copyBtn).toBeInTheDocument();
      expect(copyBtn).toHaveTextContent('Copy');

      fireEvent.click(copyBtn);

      expect(writeTextMock).toHaveBeenCalledWith('dfan@umass.edu');
      await waitFor(() => {
        expect(screen.getByText('Copied')).toBeInTheDocument();
      });
    });
  });

  describe('Hero Section', () => {
    it('starts with "Hi, I\'m David." without uppercase DAVID FAN treatment', () => {
      const { container } = render(<App />);

      // Greeting starts with "Hi, I'm David."
      expect(screen.getByText("Hi, I'm David.")).toBeInTheDocument();

      // Old "DAVID FAN" introductory text is gone
      const allText = container.textContent || '';
      expect(allText).not.toMatch(/DAVID FAN/);

      // Core personal headline and subline are rendered
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        siteContent.hero.headline
      );
      expect(screen.getByText(siteContent.hero.subline)).toBeInTheDocument();

      // Hero only has single Work link, no repeated social icons
      const heroWorkLink = screen.getByRole('link', { name: 'Work ↓' });
      expect(heroWorkLink).toHaveAttribute('href', '#work');
    });

    it('renders slow ambient animated background confined to hero section', () => {
      const { container } = render(<App />);

      const heroSection = container.querySelector('.hero-section');
      expect(heroSection).toBeInTheDocument();

      const heroAmbient = heroSection?.querySelector('.hero-ambient');
      expect(heroAmbient).toBeInTheDocument();
      expect(heroAmbient).toHaveAttribute('aria-hidden', 'true');

      expect(heroSection?.querySelector('.hero-aura-primary')).toBeInTheDocument();
      expect(heroSection?.querySelector('.hero-aura-secondary')).toBeInTheDocument();
      expect(heroSection?.querySelector('.hero-aura-tertiary')).toBeInTheDocument();
      expect(heroSection?.querySelector('.hero-grain')).toBeInTheDocument();
    });
  });

  describe('Work Section', () => {
    it('renders simple project list for PreBase and Coreside', () => {
      render(<App />);

      expect(
        screen.getByRole('heading', { level: 3, name: 'PreBase' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 3, name: 'Coreside' })
      ).toBeInTheDocument();

      expect(
        screen.getByText('A codebase mapping IDE for seeing how software connects.')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'A personal software environment where conversations can become useful tools.'
        )
      ).toBeInTheDocument();

      const projectList = screen.getByRole('list', { name: 'Projects' });
      expect(projectList.children.length).toBe(2);
    });

    it('renders PreBase GitHub repo icon and website globe icon', () => {
      render(<App />);

      const prebaseGitHub = screen.getByRole('link', {
        name: /PreBase GitHub repository/i,
      });
      expect(prebaseGitHub).toBeInTheDocument();
      expect(prebaseGitHub).toHaveAttribute(
        'href',
        'https://github.com/Qtrick/prebasecode'
      );
      expect(prebaseGitHub).toHaveAttribute('target', '_blank');

      const prebaseWebsite = screen.getByRole('link', {
        name: /PreBase website/i,
      });
      expect(prebaseWebsite).toBeInTheDocument();
      expect(prebaseWebsite).toHaveAttribute(
        'href',
        'https://prebase.vercel.app'
      );
      expect(prebaseWebsite).toHaveAttribute('target', '_blank');
    });

    it('renders Coreside with GitHub repo icon only', () => {
      render(<App />);

      const coresideGitHub = screen.getByRole('link', {
        name: /Coreside GitHub repository/i,
      });
      expect(coresideGitHub).toBeInTheDocument();
      expect(coresideGitHub).toHaveAttribute(
        'href',
        'https://github.com/Qtrick/coreside'
      );
      expect(coresideGitHub).toHaveAttribute('target', '_blank');

      // No website link for Coreside
      expect(
        screen.queryByRole('link', { name: /Coreside website/i })
      ).not.toBeInTheDocument();
    });

    it('no demo components or interactive tabs exist in Work section', () => {
      const { container } = render(<App />);

      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
      expect(screen.queryByRole('tab')).not.toBeInTheDocument();
      expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Try prompt/i })).not.toBeInTheDocument();
      expect(container.querySelector('.project-visual-wrapper')).not.toBeInTheDocument();
    });
  });

  describe('About Section', () => {
    it('mentions classical music and local community volunteering in student tone', () => {
      render(<App />);

      expect(
        screen.getByText(/I enjoy listening to classical music/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/doing volunteer work for local communities/i)
      ).toBeInTheDocument();
    });

    it('completely excludes Tech Regalia', () => {
      const { container } = render(<App />);
      expect(container.textContent).not.toContain('Tech Regalia');
      expect(screen.queryByText(/Tech Regalia/i)).not.toBeInTheDocument();
    });

    it('only mentions U.S. Wushu Team for martial arts', () => {
      render(<App />);
      expect(screen.getByText(/U\.S\. Wushu Team/i)).toBeInTheDocument();
    });

    it('does not repeat GitHub or LinkedIn links in About section', () => {
      const { container } = render(<App />);
      const aboutSection = container.querySelector('#about');
      expect(aboutSection).toBeInTheDocument();

      const aboutLinks = aboutSection?.querySelectorAll('a') || [];
      expect(aboutLinks.length).toBe(0);
    });
  });

  describe('Accessibility, Theme & Motion', () => {
    it('contains ZERO em dashes in user-facing text', () => {
      const { container } = render(<App />);
      expect(container.textContent).not.toContain('—');
    });

    it('toggles light/dark theme', () => {
      render(<App />);

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');

      const themeToggleBtn = screen.getByRole('button', {
        name: /Switch to dark theme/i,
      });
      fireEvent.click(themeToggleBtn);

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(localStorage.getItem('df_portfolio_theme')).toBe('dark');

      const lightToggleBtn = screen.getByRole('button', {
        name: /Switch to light theme/i,
      });
      fireEvent.click(lightToggleBtn);
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('contains skip link and section landmarks', () => {
      render(<App />);

      expect(document.getElementById('work')).toBeInTheDocument();
      expect(document.getElementById('about')).toBeInTheDocument();
      expect(document.getElementById('main-content')).toBeInTheDocument();

      const skipLink = screen.getByText('Skip to main content');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('respects prefers-reduced-motion for instant reveal', () => {
      const matchMediaSpy = vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(<App />);

      const workSection = document.getElementById('work');
      expect(workSection).toHaveClass('is-revealed');

      const aboutSection = document.getElementById('about');
      expect(aboutSection).toHaveClass('is-revealed');

      matchMediaSpy.mockRestore();
    });
  });
});
