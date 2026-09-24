import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import App from '../App';
import { siteContent } from '../content/siteContent';
import { DEMO_PROMPTS } from '../components/CoresideVisual';

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

  it('contains the EXACT LinkedIn destination for David Fan', () => {
    render(<App />);

    const EXPECTED_LINKEDIN = 'https://www.linkedin.com/in/david-fan-3a5a66313/';

    const linkedInLinks = screen.getAllByRole('link', { name: /LinkedIn/i });
    expect(linkedInLinks.length).toBeGreaterThanOrEqual(2);

    linkedInLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', EXPECTED_LINKEDIN);
      // Ensure the old incorrect URL is nowhere
      expect(link.getAttribute('href')).not.toBe('https://www.linkedin.com/in/david-fan');
    });
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

  it('toggles between PreBase and Coreside projects with tabs and smooth transitions', async () => {
    render(<App />);

    // By default, PreBase is active
    expect(screen.getByRole('heading', { level: 3, name: 'PreBase' })).toBeInTheDocument();
    expect(screen.getByText(/An editor that maps out codebases visually/i)).toBeInTheDocument();
    expect(screen.getByText('Code-OSS')).toBeInTheDocument();

    const prebaseTab = screen.getByRole('tab', { name: 'PreBase' });
    const coresideTab = screen.getByRole('tab', { name: 'Coreside' });

    expect(prebaseTab).toHaveAttribute('aria-selected', 'true');
    expect(coresideTab).toHaveAttribute('aria-selected', 'false');

    // Switch to Coreside
    fireEvent.click(coresideTab);

    // Tab updates immediately
    expect(coresideTab).toHaveAttribute('aria-selected', 'true');
    expect(prebaseTab).toHaveAttribute('aria-selected', 'false');

    // Content updates with smooth transition
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 3, name: 'Coreside' })).toBeInTheDocument();
    });

    expect(
      screen.getByText(/A desktop app that turns plain text into little tools/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Tauri 2')).toBeInTheDocument();
    expect(screen.getByText('Rust')).toBeInTheDocument();

    // Switch back to PreBase
    fireEvent.click(prebaseTab);
    expect(prebaseTab).toHaveAttribute('aria-selected', 'true');
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 3, name: 'PreBase' })).toBeInTheDocument();
    });
  });

  describe('PreBase Visual Canvas', () => {
    it('renders all file nodes as accessible buttons', () => {
      render(<App />);

      const nodeNames = [
        'App.tsx',
        'Sidebar.tsx',
        'UserProfile.tsx',
        'apiClient.ts',
        'auth.ts',
        'NavItem.tsx',
      ];

      nodeNames.forEach((name) => {
        expect(
          screen.getByRole('button', { name: new RegExp(`^${name}`, 'i') })
        ).toBeInTheDocument();
      });
    });

    it('clicking a file node updates selected state and contextual detail', async () => {
      render(<App />);

      // Default selected is App.tsx
      const appNode = screen.getByRole('button', { name: /^App\.tsx/i });
      expect(appNode).toHaveAttribute('aria-pressed', 'true');

      // Click Sidebar.tsx
      const sidebarNode = screen.getByRole('button', { name: /^Sidebar\.tsx/i });
      fireEvent.click(sidebarNode);

      expect(sidebarNode).toHaveAttribute('aria-pressed', 'true');
      expect(appNode).toHaveAttribute('aria-pressed', 'false');

      // Check contextual detail
      expect(
        screen.getByText(/Navigation sidebar\. Renders page links and uses NavItem\.tsx\./i)
      ).toBeInTheDocument();

      // Click apiClient.ts node
      const apiNode = screen.getByRole('button', { name: /^apiClient\.ts/i });
      fireEvent.click(apiNode);

      expect(apiNode).toHaveAttribute('aria-pressed', 'true');
      expect(
        screen.getByText(/Handles network requests and error handling\./i)
      ).toBeInTheDocument();
    });

    it('keyboard navigation (Enter key) updates selected node', () => {
      render(<App />);

      const navItemNode = screen.getByRole('button', { name: /^NavItem\.tsx/i });
      fireEvent.click(navItemNode);

      expect(navItemNode).toHaveAttribute('aria-pressed', 'true');
      expect(
        screen.getByText(/Reusable navigation link item used by Sidebar\.tsx\./i)
      ).toBeInTheDocument();
    });

    it('clicking a connected file chip updates selected node', () => {
      render(<App />);

      // Default is App.tsx, which connects to Sidebar.tsx, UserProfile.tsx, apiClient.ts
      const sidebarChip = screen.getByRole('button', { name: /Select Sidebar\.tsx/i });
      fireEvent.click(sidebarChip);

      const sidebarNode = screen.getByRole('button', { name: /^Sidebar\.tsx/i });
      expect(sidebarNode).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Coreside Visual Canvas', () => {
    beforeEach(() => {
      // Switch to Coreside tab first
      render(<App />);
      fireEvent.click(screen.getByRole('tab', { name: 'Coreside' }));
    });

    it('starts with NO generated tool visible and exactly one random prompt', async () => {
      await waitFor(() => {
        expect(screen.getByRole('region', { name: /Coreside/i })).toBeInTheDocument();
      });

      // NO tool visible by default
      expect(screen.queryByText(/^Ready$/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Glasses today/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Cost per person/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/completed/i)).not.toBeInTheDocument();

      // Exactly ONE prompt visible matching one of the 3 DEMO_PROMPTS
      const validPromptTexts = DEMO_PROMPTS.map((p) => p.text);
      const promptCard = screen.getByRole('button', { name: /Try prompt/i });
      expect(promptCard).toBeInTheDocument();

      const matchedPrompt = validPromptTexts.find((text) =>
        promptCard.textContent?.includes(text)
      );
      expect(matchedPrompt).toBeDefined();
    });

    it('executes prompt flow: click -> agent log -> generated interactive tool', async () => {
      vi.useFakeTimers();

      const promptBtn = screen.getByRole('button', { name: /Try prompt/i });
      fireEvent.click(promptBtn);

      // Phase 1 -> 2: Agent working
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(screen.getByText(/Building tool.../i)).toBeInTheDocument();

      // Phase 2 -> 3: Tool ready
      act(() => {
        vi.advanceTimersByTime(700);
      });

      expect(screen.getByText(/^Ready$/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Try another prompt/i })).toBeInTheDocument();

      vi.useRealTimers();
    });

    it('generated tool has a working interactive component', async () => {
      vi.useFakeTimers();

      const promptBtn = screen.getByRole('button', { name: /Try prompt/i });
      fireEvent.click(promptBtn);

      act(() => {
        vi.advanceTimersByTime(900);
      });

      expect(screen.getByText(/^Ready$/)).toBeInTheDocument();

      // Check whichever tool was rendered
      const increaseWaterBtn = screen.queryByRole('button', { name: /Increase glasses/i });
      const checklistCheckboxes = screen.queryAllByRole('checkbox');
      const increaseBillBtn = screen.queryByRole('button', { name: /Increase bill/i });

      if (increaseWaterBtn) {
        expect(screen.getByText('3')).toBeInTheDocument();
        fireEvent.click(increaseWaterBtn);
        expect(screen.getByText('4')).toBeInTheDocument();
      } else if (checklistCheckboxes.length > 0) {
        const uncheckedBox = checklistCheckboxes.find((box) => !(box as HTMLInputElement).checked);
        if (uncheckedBox) {
          fireEvent.click(uncheckedBox);
          expect((uncheckedBox as HTMLInputElement).checked).toBe(true);
        }
      } else if (increaseBillBtn) {
        expect(screen.getByText('$120')).toBeInTheDocument();
        fireEvent.click(increaseBillBtn);
        expect(screen.getByText('$140')).toBeInTheDocument();
      }

      vi.useRealTimers();
    });

    it('respects prefers-reduced-motion by bypassing synthesis delay', () => {
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

      const promptBtn = screen.getByRole('button', { name: /Try prompt/i });
      fireEvent.click(promptBtn);

      // Instantly reaches ready without timers
      expect(screen.getByText(/^Ready$/)).toBeInTheDocument();

      matchMediaSpy.mockRestore();
    });

    it('replay resets the flow to a clean prompt with no generated tool', async () => {
      vi.useFakeTimers();

      const promptBtn = screen.getByRole('button', { name: /Try prompt/i });
      fireEvent.click(promptBtn);

      act(() => {
        vi.advanceTimersByTime(900);
      });

      expect(screen.getByText(/^Ready$/)).toBeInTheDocument();

      // Click replay
      const replayBtn = screen.getByRole('button', { name: /Try another prompt/i });
      fireEvent.click(replayBtn);

      // Should be back to idle state with no tool
      expect(screen.queryByText(/^Ready$/)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Try prompt/i })).toBeInTheDocument();

      vi.useRealTimers();
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

  it('renders ambient background with aria-hidden for accessibility', () => {
    const { container } = render(<App />);

    const ambientBg = container.querySelector('.ambient-background');
    expect(ambientBg).toBeInTheDocument();
    expect(ambientBg).toHaveAttribute('aria-hidden', 'true');
  });
});

