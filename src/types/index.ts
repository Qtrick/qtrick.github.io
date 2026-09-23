export interface ProjectItem {
  id: string;
  name: string;
  tagline: string;
  role: string;
  status: string;
  technologies: string[];
  githubUrl: string;
  description: string;
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
    subline: string;
    links: Array<{ label: string; href: string; external?: boolean }>;
  };
  work: {
    sectionTitle: string;
    projects: ProjectItem[];
  };
  about: {
    sectionTitle: string;
    bio: string[];
    email: string;
    links: SocialLink[];
  };
  footer: {
    copyright: string;
  };
}
