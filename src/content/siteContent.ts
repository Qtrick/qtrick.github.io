/* CONTENT IS PROVISIONAL.
   This portfolio is intentionally content-driven so David can rewrite any copy easily.
   Keep sentences simple, honest, and personal. */

import { SiteContent } from '../types';

export const siteContent: SiteContent = {
  meta: {
    title: 'David Fan',
    description:
      'David Fan is a biology student at UMass Amherst building PreBase and Coreside.',
    author: 'David Fan',
    url: 'https://qtrick.github.io',
  },

  navigation: [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'GitHub', href: 'https://github.com/Qtrick' },
  ],

  hero: {
    name: 'David Fan',
    headline: 'I’m a biology student at UMass Amherst who likes building things.',
    subline: 'Currently building PreBase and Coreside.',
    links: [
      { label: 'Work ↓', href: '#work' },
      { label: 'GitHub ↗', href: 'https://github.com/Qtrick', external: true },
      { label: 'LinkedIn ↗', href: 'https://www.linkedin.com/in/david-fan-3a5a66313/', external: true },
    ],
  },

  work: {
    sectionTitle: 'Work',
    projects: [
      {
        id: 'prebase',
        name: 'PreBase',
        tagline: 'A codebase-mapping IDE for exploring software architecture.',
        description:
          'Built on Code-OSS, PreBase maps code relationships and dependencies into an interactive visual graph directly inside the editor so you can navigate codebases spatially.',
        role: 'Co-founder',
        status: 'In development',
        technologies: ['TypeScript', 'Code-OSS', 'Electron', 'Graphs'],
        githubUrl: 'https://github.com/Qtrick/prebasecode',
      },
      {
        id: 'coreside',
        name: 'Coreside',
        tagline: 'A desktop environment where conversations become interactive tools.',
        description:
          'You ask for a capability—like a tracker, checklist, or calculator—and Coreside turns your prompt into a declarative tool that persists locally in SQLite.',
        role: 'Creator',
        status: 'In development',
        technologies: ['Rust', 'Tauri 2', 'React', 'SQLite'],
        githubUrl: 'https://github.com/Qtrick/coreside',
      },
    ],
  },

  about: {
    sectionTitle: 'About',
    bio: [
      'I study biology at UMass Amherst and spend most of my free time building software.',
      'Outside of school and coding, I compete on the U.S. Wushu Team representing the United States in international kung-fu competitions, and co-founded Tech Regalia.',
    ],
    email: 'davidwfan26@gmail.com',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/Qtrick',
        icon: 'github',
      },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/david-fan-3a5a66313/',
        icon: 'linkedin',
      },
      {
        label: 'Email',
        href: 'mailto:davidwfan26@gmail.com',
        icon: 'mail',
      },
    ],
  },

  footer: {
    copyright: 'David Fan · 2026',
  },
};
