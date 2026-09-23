/* CONTENT IS PROVISIONAL. This portfolio is intentionally content-driven so the owner can rewrite the copy without changing the component structure. */

import { SiteContent } from '../types';

export const siteContent: SiteContent = {
  meta: {
    title: 'David Fan — Builder',
    description:
      'Personal portfolio of David Fan. Freshman biology major at UMass Amherst building PreBase (a codebase mapping IDE) and Coreside (an AI-native personal software environment).',
    author: 'David Fan',
    url: 'https://qtrick.github.io',
  },

  navigation: [
    { label: 'Work', href: '#work' },
    { label: 'Now', href: '#now' },
    { label: 'About', href: '#about' },
    { label: 'Outside', href: '#outside' },
    { label: 'Contact', href: '#contact' },
  ],

  hero: {
    name: 'David Fan',
    headline: 'Biology student. Builder.',
    subheadline:
      'Freshman studying biology at UMass Amherst and spending most of my time building software.',
    bioLine:
      'Currently focused on PreBase (a codebase-mapping IDE) and Coreside (a personal software environment built around persistent, trusted tools).',
    primaryCta: {
      text: 'See what I’m building',
      href: '#work',
    },
    secondaryCta: {
      text: 'GitHub',
      href: 'https://github.com/Qtrick',
    },
  },

  featuredProjects: {
    sectionTitle: 'Selected Work',
    sectionEyebrow: 'Proof of Work',
    sectionDescription:
      'Software I have architected and actively build. Each project explores how tools can give people better spatial, structural, or persistent capabilities.',
    items: [
      {
        id: 'prebase',
        slug: 'prebase',
        name: 'PreBase',
        eyebrow: 'Codebase Mapping IDE',
        tagline:
          'An IDE built around understanding a codebase as a living system, not just editing isolated files.',
        role: 'Co-founder / Builder',
        status: 'Active Development',
        technologies: ['TypeScript', 'Code-OSS 1.128', 'Electron', 'Temporal Graphs', 'Gemini'],
        githubUrl: 'https://github.com/Qtrick/prebasecode',
        overview:
          'PreBase is an AI-assisted desktop IDE and code-visualization platform built on Code-OSS. It introduces interactive Architecture and Network Maps directly into the workbench so developers can navigate and reason about complex codebases spatially and structurally.',
        whyBuilt:
          'When codebases grow to hundreds of files, traditional nested directory trees fail to show how components communicate. I wanted an environment where the architecture map is an active workspace surface, helping developers and agents see system connections before making changes.',
        whatBuilt: [
          'Engineered an Architecture and Network graph subsystem hosted directly alongside the Code-OSS workbench.',
          'Integrated in-IDE Runtime Preview for frontend development servers (Vite, Next.js).',
          'Built the Gemini-backed agent participant ("Magnus") hooked into the VS Code 1.128 chat stack with codebase-graph awareness.',
          'Established strict verification gates (verify:graphs-boundary, verify:privacy) and a TypeScript dual-lane compilation pipeline.',
        ],
        technicalDecisions: [
          {
            label: 'Strict Subsystem Boundaries',
            detail:
              'Kept all graph visualization algorithms isolated under graphs/ with automated boundary audit scripts to prevent workbench coupling.',
          },
          {
            label: 'Spatial System Representation',
            detail:
              'Treated file connections, imports, and component interactions as a navigable network rather than flat textual lists.',
          },
          {
            label: 'Native Host Integration',
            detail:
              'Built directly against the Code-OSS 1.128 runtime rather than creating a toy web prototype, guaranteeing full editor capabilities.',
          },
        ],
        currentStatus:
          'The core workbench, interactive maps, and runtime preview are operational from source; current development focuses on temporal graph history and richer agent context hooks.',
        visualType: 'prebase-graph',
      },
      {
        id: 'coreside',
        slug: 'coreside',
        name: 'Coreside',
        eyebrow: 'Personal Software Environment',
        tagline:
          'A personal desktop software environment where conversations become persistent, interactive tools.',
        role: 'Creator / Builder',
        status: 'Consumer MVP Foundation',
        technologies: ['Tauri 2', 'Rust', 'React', 'TypeScript', 'Vite', 'SQLite'],
        githubUrl: 'https://github.com/Qtrick/coreside',
        overview:
          'Coreside begins as a conversational assistant and builds interactive tools directly inside itself. When you ask for a tool—like an expense calculator, study checklist, or tracker—it synthesizes a declarative UI that persists locally, updates through dialogue, and can launch in dedicated native windows.',
        whyBuilt:
          'Most conversational AI generates fleeting text that disappears into chat history. I wanted conversations to produce lasting personal software. At the same time, letting an AI generate arbitrary executable JavaScript on a local machine is dangerous; Coreside proves how generated software can be interactive and persistent while remaining safely constrained.',
        whatBuilt: [
          'Designed a split architecture: a trusted Rust core for secrets, OS integration, and SQLite, paired with a React/TypeScript interface.',
          'Built a declarative component registry that renders UI from validated JSON specifications rather than unrestricted HTML or remote scripts.',
          'Implemented a preview → apply → discard workflow with full version snapshots and instant rollback.',
          'Added local web research pipelines (Crawl4AI + Exa) and secondary native window management via Tauri 2.',
        ],
        technicalDecisions: [
          {
            label: 'Declarative Safety Boundary',
            detail:
              'Rejected unrestricted HTML/JS execution. The AI outputs validated JSON schemas targeting a curated component library, preventing script injection.',
          },
          {
            label: 'Local-First SQLite Persistence',
            detail:
              'All conversations, tools, versions, and configurations persist on the user’s device using rusqlite with zero mandatory cloud accounts.',
          },
          {
            label: 'Protected Rust Kernel',
            detail:
              'API credentials and OS system calls are isolated entirely inside Rust; the web view never sees sensitive keys.',
          },
        ],
        currentStatus:
          'Desktop application running on Tauri 2 with Gemini provider support, SQLite persistence, and verified declarative UI generation.',
        visualType: 'coreside-flow',
      },
    ],
  },

  now: {
    sectionTitle: 'Currently',
    sectionEyebrow: 'Now',
    intro:
      'A snapshot of what I’m currently focused on in my freshman year:',
    focusList: [
      'Studying biology at UMass Amherst, exploring the intersection between biological systems and computational modeling.',
      'Refining PreBase’s codebase mapping infrastructure and experimenting with temporal graph navigation.',
      'Expanding Coreside’s declarative component registry and patch scheduler for more complex personal tools.',
      'Deepening practical knowledge in systems programming, compilers, and local-first architecture.',
    ],
  },

  about: {
    sectionTitle: 'About Me',
    sectionEyebrow: 'Background',
    paragraphs: [
      'I am a freshman studying biology at the University of Massachusetts Amherst. While my academic focus is in the life sciences, I spend much of my free time building software and exploring how tools can make complex systems easier to understand.',
      'I believe in proof of work: the best way to understand an idea is to build a real working prototype, test its edges, and solve the messy architectural problems that only appear when you write actual code. Whether working on desktop IDE extensions or local-first runtime environments, I care about craft, clean boundaries, and building software I wish already existed.',
    ],
  },

  outside: {
    sectionTitle: 'Outside of Software',
    sectionEyebrow: 'Life & Interests',
    intro:
      'A few disciplines outside of code that shape how I think about focus, responsibility, and persistence:',
    items: [
      {
        title: 'U.S. Wushu Team',
        role: 'National Team Athlete',
        description:
          'Athlete on the U.S. Wushu Team, representing the United States in international kung-fu competitions. Martial arts taught me discipline, precision, and thousands of hours of quiet repetition.',
      },
      {
        title: 'Youth Soccer Referee',
        role: 'Center & Assistant Referee',
        description:
          'Officiated youth soccer for Acton-Boxborough Youth Soccer. Learned fast decision-making, clear communication under pressure, and how to calmly de-escalate on-field conflict.',
      },
      {
        title: 'Tech Regalia',
        role: 'Co-founder',
        description:
          'Co-founded a handcrafted jewelry venture handling financial operations, physical prototyping, brand positioning, and business partnerships.',
      },
    ],
  },

  contact: {
    sectionTitle: 'Contact',
    sectionEyebrow: 'Get in Touch',
    headline: 'Interested in building something ambitious?',
    body:
      'I’m always happy to talk about software architecture, codebase visualization, biology, or new projects.',
    email: 'davidwfan26@gmail.com',
    socials: [
      {
        label: 'GitHub',
        href: 'https://github.com/Qtrick',
        icon: 'github',
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
    note: 'Built with React, TypeScript, and Vite. Hosted on GitHub Pages.',
  },
};
