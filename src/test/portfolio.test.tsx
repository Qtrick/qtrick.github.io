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

    // Check main heading identity
    const mainHeading = screen.getByRole('heading', { level: 1, name: 'David Fan' });
    expect(mainHeading).toBeInTheDocument();
    expect(screen.getByText('Biology student. Builder.')).toBeInTheDocument();

    // Check navigation items
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '#work');
    expect(screen.getByRole('link', { name: 'Now' })).toHaveAttribute('href', '#now');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about');
    expect(screen.getByRole('link', { name: 'Outside' })).toHaveAttribute('href', '#outside');
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact');
  });

  it('renders featured projects from centralized siteContent (PreBase and Coreside)', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 3, name: 'PreBase' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Coreside' })).toBeInTheDocument();
    expect(screen.getByText('Codebase Mapping IDE')).toBeInTheDocument();
    expect(screen.getByText('Personal Software Environment')).toBeInTheDocument();

    // Check technology tags
    expect(screen.getByText('Code-OSS 1.128')).toBeInTheDocument();
    expect(screen.getByText('Tauri 2')).toBeInTheDocument();
    expect(screen.getByText('Rust')).toBeInTheDocument();
  });

  it('expands project architecture deep dive on toggle', async () => {
    render(<App />);

    const archToggleButtons = screen.getAllByRole('button', {
      name: /Technical Architecture/i,
    });
    expect(archToggleButtons.length).toBeGreaterThan(0);

    // Expand PreBase deep dive
    fireEvent.click(archToggleButtons[0]);

    // Check that deep dive content is now revealed
    await waitFor(() => {
      expect(screen.getByText(/Why I Built This/i)).toBeInTheDocument();
      expect(screen.getByText(/What I Built & Contributed/i)).toBeInTheDocument();
      expect(screen.getByText(/Key Architectural Decisions/i)).toBeInTheDocument();
      expect(screen.getByText(/Strict Subsystem Boundaries/i)).toBeInTheDocument();
    });
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

    expect(writeTextMock).toHaveBeenCalledWith(siteContent.contact.email);
    await waitFor(() => {
      expect(screen.getByText('Copied')).toBeInTheDocument();
    });
  });

  it('contains accessible anchors and correct heading hierarchy', () => {
    render(<App />);

    // Verify sections have corresponding IDs for in-page navigation
    expect(document.getElementById('work')).toBeInTheDocument();
    expect(document.getElementById('now')).toBeInTheDocument();
    expect(document.getElementById('about')).toBeInTheDocument();
    expect(document.getElementById('outside')).toBeInTheDocument();
    expect(document.getElementById('contact')).toBeInTheDocument();

    // Verify skip to content link exists and points to main-content
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });
});
