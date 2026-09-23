/* CONTENT IS PROVISIONAL.
   This portfolio is intentionally content-driven so David can rewrite any copy easily.
   Keep sentences simple, honest, and personal. */

import { SiteContent } from '../types';

export const siteContent: SiteContent = {
  meta: {
    title: 'David Fan',
    description:
      'Personal portfolio of David Fan. Biology student at UMass Amherst building PreBase and Coreside.',
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
      { label: 'See work ↓', href: '#work' },
      { label: 'GitHub ↗', href: 'https://github.com/Qtrick', external: true },
      { label: 'LinkedIn ↗', href: 'https://www.linkedin.com/in/david-fan', external: true },
    ],
  },

  work: {
    sectionTitle: 'Work',
    projects: [
      {
        id: 'prebase',
        name: 'PreBase',
        tagline: 'A codebase-mapping IDE for understanding software as a system.',
        description:
          'Built on Code-OSS, PreBase maps repository architecture and dependencies into an interactive graph directly inside the editor so you can navigate code spatially.',
        role: 'Co-founder',
        status: 'Active development',
        technologies: ['TypeScript', 'Code-OSS', 'Electron', 'Graphs'],
        githubUrl: 'https://github.com/Qtrick/prebasecode',
      },
      {
        id: 'coreside',
        name: 'Coreside',
        tagline: 'A desktop environment where conversations turn into persistent tools.',
        description:
          'You chat with an assistant to request a tool—like a tracker, checklist, or calculator—and Coreside synthesizes declarative UI tools that persist in local SQLite and run in native desktop windows.',
        role: 'Creator',
        status: 'Active development',
        technologies: ['Rust', 'Tauri 2', 'React', 'SQLite'],
        githubUrl: 'https://github.com/Qtrick/coreside',
      },
    ],
  },

  about: {
    sectionTitle: 'About',
    bio: [
      'I study biology at UMass Amherst and spend most of my free time building software.',
      'Outside of school and programming, I compete as an athlete on the U.S. Wushu Team representing the United States in international kung-fu competitions, and co-founded Tech Regalia.',
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
        href: 'https://www.linkedin.com/in/david-fan',
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
