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
        description: 'A codebase mapping IDE for seeing how software connects.',
        githubUrl: 'https://github.com/Qtrick/prebasecode',
      },
      {
        id: 'coreside',
        name: 'Coreside',
        description:
          'A personal software environment where conversations can become useful tools.',
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
    email: 'dfan@umass.edu',
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
    ],
  },

  footer: {
    copyright: 'David Fan · 2026',
  },
};

