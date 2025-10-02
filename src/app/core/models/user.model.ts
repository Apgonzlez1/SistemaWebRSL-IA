export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Study {
  id: string;
  title: string;
  authors: string;
  year: number;
  status: 'pending' | 'screening' | 'included' | 'excluded';
  source: string;
  abstract: string;
  relevanceScore?: number;
}

export interface PrismaItem {
  id: string;
  section: string;
  item: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'needs-review';
  aiScore?: number;
  aiSuggestions?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  totalStudies: number;
  screenedStudies: number;
  includedStudies: number;
  excludedStudies: number;
  prismaProgress: number;
  createdAt: Date;
  updatedAt: Date;
}