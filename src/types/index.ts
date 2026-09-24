export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  githubUrl: string;
  websiteUrl?: string;
  descriptor?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
}

export interface SiteContent {
  meta: {
    title: string;
    description: string;
    author: string;
    url: string;
  };
  ownerName: string;
  navigation: NavItem[];
  social: SocialLinks;
  hero: {
    greeting: string;
    headline: string;
    subline: string;
  };
  work: {
    sectionTitle: string;
    projects: ProjectItem[];
  };
  about: {
    sectionTitle: string;
    bio: string[];
  };
  footer: {
    copyright: string;
  };
}
