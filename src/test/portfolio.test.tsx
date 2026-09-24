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

  it('renders identity, headline, and primary navigation', () => {
    render(<App />);

    // Check main heading and headline
    const headline = screen.getByRole('heading', { level: 1 });
    expect(headline).toHaveTextContent(siteContent.hero.headline);
    expect(screen.getAllByText(siteContent.hero.name).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(siteContent.hero.subline)).toBeInTheDocument();

    // Check navigation items
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '#work');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about');

    const githubLinks = screen.getAllByRole('link', { name: /GitHub/i });
    expect(githubLinks.length).toBeGreaterThanOrEqual(1);
    expect(githubLinks[0]).toHaveAttribute('href', 'https://github.com/Qtrick');
  });

  it('renders both projects simultaneously as a simple list', () => {
    render(<App />);

    // Both projects must be rendered at the same time
    const prebaseHeading = screen.getByRole('heading', { level: 3, name: 'PreBase' });
    const coresideHeading = screen.getByRole('heading', { level: 3, name: 'Coreside' });

    expect(prebaseHeading).toBeInTheDocument();
    expect(coresideHeading).toBeInTheDocument();

    // Verify concise, human project descriptions
    expect(
      screen.getByText('A codebase mapping IDE for seeing how software connects.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('A personal software environment where conversations can become useful tools.')
    ).toBeInTheDocument();

    // Verify semantic list markup is used
    const projectList = screen.getByRole('list', { name: 'Projects' });
    expect(projectList).toBeInTheDocument();
    expect(projectList.children.length).toBe(2);
  });

  it('PreBase GitHub link is correct', () => {
    render(<App />);

    const prebaseLink = screen.getByRole('link', {
      name: /View PreBase repository on GitHub/i,
    });
    expect(prebaseLink).toBeInTheDocument();
    expect(prebaseLink).toHaveAttribute('href', 'https://github.com/Qtrick/prebasecode');
    expect(prebaseLink).toHaveAttribute('target', '_blank');
    expect(prebaseLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('Coreside GitHub link is correct', () => {
    render(<App />);

    const coresideLink = screen.getByRole('link', {
      name: /View Coreside repository on GitHub/i,
    });
    expect(coresideLink).toBeInTheDocument();
    expect(coresideLink).toHaveAttribute('href', 'https://github.com/Qtrick/coreside');
    expect(coresideLink).toHaveAttribute('target', '_blank');
    expect(coresideLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('no project demo components or interactive canvas are rendered', () => {
    const { container } = render(<App />);

    // No node graph, no interactive prompt cards, no agent logs, no generated tools
    expect(screen.queryByRole('button', { name: /Try prompt/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Building tool.../i)).not.toBeInTheDocument();
    expect(screen.queryByText(/App\.tsx/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sidebar\.tsx/i)).not.toBeInTheDocument();
    expect(container.querySelector('.project-visual-wrapper')).not.toBeInTheDocument();
    expect(container.querySelector('.project-display-panel')).not.toBeInTheDocument();
  });

  it('no project toggle or tabs exist', () => {
    render(<App />);

    // No tablist, no tabs, no tabpanels
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
  });

  it('completely excludes Tech Regalia from the entire site', () => {
    const { container } = render(<App />);
    expect(container.textContent).not.toContain('Tech Regalia');
    expect(screen.queryByText(/Tech Regalia/i)).not.toBeInTheDocument();
  });

  it('contains ZERO em dashes in any user-facing text', () => {
    const { container } = render(<App />);
    expect(container.textContent).not.toContain('—');
  });

  it('contains the EXACT LinkedIn destination for David Fan', () => {
    render(<App />);

    const EXPECTED_LINKEDIN = 'https://www.linkedin.com/in/david-fan-3a5a66313/';

    const linkedInLinks = screen.getAllByRole('link', { name: /LinkedIn/i });
    expect(linkedInLinks.length).toBeGreaterThanOrEqual(2);

    linkedInLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', EXPECTED_LINKEDIN);
      expect(link.getAttribute('href')).not.toBe('https://www.linkedin.com/in/david-fan');
    });
  });

  it('displays dfan@umass.edu and uses it for mailto links', () => {
    const { container } = render(<App />);

    // Correct email is visible
    expect(screen.getByText('dfan@umass.edu')).toBeInTheDocument();

    // Mailto link uses dfan@umass.edu
    const mailtoLink = screen.getByRole('link', { name: 'dfan@umass.edu' });
    expect(mailtoLink).toHaveAttribute('href', 'mailto:dfan@umass.edu');

    // Old email is completely absent
    expect(container.textContent).not.toContain('davidwfan26@gmail.com');
  });

  it('handles email copy with visual feedback using dfan@umass.edu', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<App />);

    const copyBtn = screen.getByRole('button', { name: /Copy email address/i });
    expect(copyBtn).toBeInTheDocument();

    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith('dfan@umass.edu');
    await waitFor(() => {
      expect(screen.getByText('Copied')).toBeInTheDocument();
    });
  });

  it('toggles light/dark theme', () => {
    render(<App />);

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    const themeToggleBtn = screen.getByRole('button', { name: /Switch to dark theme/i });
    fireEvent.click(themeToggleBtn);

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('df_portfolio_theme')).toBe('dark');

    // Switch back to light
    const lightToggleBtn = screen.getByRole('button', { name: /Switch to light theme/i });
    fireEvent.click(lightToggleBtn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('contains accessible anchors and correct navigation targets', () => {
    render(<App />);

    // Verify sections have corresponding IDs for in-page navigation
    expect(document.getElementById('work')).toBeInTheDocument();
    expect(document.getElementById('about')).toBeInTheDocument();
    expect(document.getElementById('main-content')).toBeInTheDocument();

    // Verify skip to content link exists and points to main-content
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('renders ambient background with aria-hidden for accessibility', () => {
    const { container } = render(<App />);

    const ambientBg = container.querySelector('.ambient-background');
    expect(ambientBg).toBeInTheDocument();
    expect(ambientBg).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('.ambient-mesh')).toBeInTheDocument();
    expect(container.querySelector('.ambient-aura-primary')).toBeInTheDocument();
    expect(container.querySelector('.ambient-aura-secondary')).toBeInTheDocument();
    expect(container.querySelector('.ambient-grain')).toBeInTheDocument();
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

    // Work section and about section should be immediately revealed
    const workSection = document.getElementById('work');
    expect(workSection).toHaveClass('is-revealed');

    const aboutSection = document.getElementById('about');
    expect(aboutSection).toHaveClass('is-revealed');

    matchMediaSpy.mockRestore();
  });

  it('implements responsive containers across all main sections', () => {
    const { container } = render(<App />);
    const siteWrappers = container.querySelectorAll('.site-wrapper');
    expect(siteWrappers.length).toBeGreaterThanOrEqual(4);

    const projectItems = container.querySelectorAll('.project-item');
    expect(projectItems.length).toBe(2);

    const aboutContainer = container.querySelector('.about-container');
    expect(aboutContainer).toBeInTheDocument();
  });
});
