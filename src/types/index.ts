export interface ProjectArchitecturePoint {
  label: string;
  detail: string;
}

export interface ProjectData {
  id: string;
  slug: string;
  name: string;
  eyebrow: string;
  tagline: string;
  role: string;
  status: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  overview: string;
  whyBuilt: string;
  whatBuilt: string[];
  technicalDecisions: ProjectArchitecturePoint[];
  currentStatus: string;
  visualType: 'prebase-graph' | 'coreside-flow';
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: 'github' | 'linkedin' | 'mail';
}

export interface OutsideItem {
  title: string;
  role: string;
  description: string;
  period?: string;
}

export interface SiteContent {
  meta: {
    title: string;
    description: string;
    author: string;
    url: string;
  };
  navigation: NavItem[];
  hero: {
    name: string;
    headline: string;
    subheadline: string;
    bioLine: string;
    primaryCta: {
      text: string;
      href: string;
    };
    secondaryCta: {
      text: string;
      href: string;
    };
  };
  featuredProjects: {
    sectionTitle: string;
    sectionEyebrow: string;
    sectionDescription: string;
    items: ProjectData[];
  };
  now: {
    sectionTitle: string;
    sectionEyebrow: string;
    intro: string;
    focusList: string[];
  };
  about: {
    sectionTitle: string;
    sectionEyebrow: string;
    paragraphs: string[];
  };
  outside: {
    sectionTitle: string;
    sectionEyebrow: string;
    intro: string;
    items: OutsideItem[];
  };
  contact: {
    sectionTitle: string;
    sectionEyebrow: string;
    headline: string;
    body: string;
    email: string;
    socials: SocialLink[];
  };
  footer: {
    copyright: string;
    note: string;
  };
}
