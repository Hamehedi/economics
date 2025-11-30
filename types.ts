
export interface SeoMetadata {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  slug: string;
}

export interface JsonLdSchema {
  "@context": string;
  "@type": string;
  headline: string;
  datePublished: string;
  dateModified: string;
  author: {
    "@type": string;
    name: string;
  };
  publisher: {
    "@type": string;
    name: string;
  };
}

export interface TableData {
  title: string;
  headers: string[];
  rows: string[][];
  source: string;
}

export interface GeneratedPage {
  id: string;
  slug: string;
  topic: string; 
  title: string;
  htmlContent: string; 
  summary: string;
  author: string;
  publishDate: string;
  lastUpdated: string;
  category: string;
  
  // Data & Sidebar
  dataBox: TableData;
  sidebarFacts: string[];
  faq: { question: string; answer: string }[];
  
  // SEO & Technical
  seo: SeoMetadata;
  schema: JsonLdSchema;
  status: 'DRAFT' | 'PUBLISHED';
  internalLinks: { title: string; slug: string }[];
}

export enum AppState {
  HOME = 'HOME',
  VIEW_PAGE = 'VIEW_PAGE',
  CATEGORY_VIEW = 'CATEGORY_VIEW',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  TERMS_OF_SERVICE = 'TERMS_OF_SERVICE',
}