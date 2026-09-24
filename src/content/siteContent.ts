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
    headline: "I'm a biology student at UMass Amherst who likes building things.",
    subline: "Right now, I'm working on PreBase and Coreside.",
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
        tagline: 'An editor that maps out codebases visually.',
        description:
          'I wanted a better way to see how files and functions connect while reading code. Built on Code-OSS, PreBase turns code relationships into an interactive map right inside the editor.',
        role: 'Open source',
        status: 'In progress',
        technologies: ['TypeScript', 'Code-OSS', 'Electron', 'Graphs'],
        githubUrl: 'https://github.com/Qtrick/prebasecode',
      },
      {
        id: 'coreside',
        name: 'Coreside',
        tagline: 'A desktop app that turns plain text into little tools.',
        description:
          'You describe what you need, like a water tracker, a checklist, or a simple calculator. Coreside turns that prompt into an interactive tool that stays saved on your computer.',
        role: 'Personal project',
        status: 'In progress',
        technologies: ['Rust', 'Tauri 2', 'React', 'SQLite'],
        githubUrl: 'https://github.com/Qtrick/coreside',
      },
    ],
  },

  about: {
    sectionTitle: 'About',
    bio: [
      'I like figuring out how things work, then trying to build them myself.',
      'Outside of software, I compete on the U.S. Wushu Team.',
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

