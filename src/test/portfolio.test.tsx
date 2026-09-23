import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from '../App';
import { siteContent } from '../content/siteContent';

describe('David Fan Portfolio Site', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
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

  it('toggles between PreBase and Coreside projects with tabs', () => {
    render(<App />);

    // By default, PreBase is active
    expect(screen.getByRole('heading', { level: 3, name: 'PreBase' })).toBeInTheDocument();
    expect(screen.getByText(/A codebase-mapping IDE/i)).toBeInTheDocument();
    expect(screen.getByText('Code-OSS')).toBeInTheDocument();

    // Find tab buttons
    const prebaseTab = screen.getByRole('tab', { name: 'PreBase' });
    const coresideTab = screen.getByRole('tab', { name: 'Coreside' });

    expect(prebaseTab).toHaveAttribute('aria-selected', 'true');
    expect(coresideTab).toHaveAttribute('aria-selected', 'false');

    // Switch to Coreside
    fireEvent.click(coresideTab);

    expect(coresideTab).toHaveAttribute('aria-selected', 'true');
    expect(prebaseTab).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('heading', { level: 3, name: 'Coreside' })).toBeInTheDocument();
    expect(screen.getByText(/A desktop environment where conversations turn into persistent tools/i)).toBeInTheDocument();
    expect(screen.getByText('Tauri 2')).toBeInTheDocument();
    expect(screen.getByText('Rust')).toBeInTheDocument();

    // Switch back to PreBase
    fireEvent.click(prebaseTab);
    expect(prebaseTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { level: 3, name: 'PreBase' })).toBeInTheDocument();
  });

  it('toggles light/dark theme', () => {
    render(<App />);

    // Default theme is warm off-white light theme
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

  it('handles email copy with visual feedback', async () => {
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

    expect(writeTextMock).toHaveBeenCalledWith(siteContent.about.email);
    await waitFor(() => {
      expect(screen.getByText('Copied')).toBeInTheDocument();
    });
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
});
