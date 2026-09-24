import { SiteContent } from '../types';

export const siteContent: SiteContent = {
  meta: {
    title: 'David Fan',
    description:
      'David Fan is a biology student at UMass Amherst building PreBase and Coreside.',
    author: 'David Fan',
    url: 'https://qtrick.github.io',
  },

  ownerName: 'David Fan',

  navigation: [
    { label: 'About', href: '#about' },
  ],

  social: {
    github: 'https://github.com/Qtrick',
    linkedin: 'https://www.linkedin.com/in/david-fan-3a5a66313/',
    email: 'dfan@umass.edu',
  },

  hero: {
    greeting: "Hi, I'm David.",
    headline: "I'm a biology student at UMass Amherst who likes building.",
    subline: 'My interests are currently in AI, educational tech, and startups.',
  },

  work: {
    sectionTitle: 'Work',
    projects: [
      {
        id: 'prebase',
        name: 'PreBase',
        description: 'A codebase mapping IDE for seeing how software connects.',
        githubUrl: 'https://github.com/Qtrick/prebasecode',
        websiteUrl: 'https://prebase.vercel.app',
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
      'Outside of class, I listen to classical music, do volunteer work for local communities, and compete on the U.S. Wushu Team.',
    ],
  },

  footer: {
    copyright: 'David Fan · 2026',
  },
};
