export interface ProjectDoc {
  $id: string;
  title: string;
  description: string;
  tags?: string[];
  imageId?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  order?: number;
}

export interface SkillDoc {
  $id: string;
  name: string;
  category: string;
  level?: number;
  order?: number;
}

export interface ExperienceDoc {
  $id: string;
  company: string;
  role: string;
  location?: string;
  description: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  order?: number;
}

export interface SettingsDoc {
  $id?: string;
  profileFileId?: string;
  cvFileId?: string;
}

export interface ArticleDoc {
  $id: string;
  title: string;
  abstract: string;
  journal?: string;
  authors?: string[];
  publishedDate?: string;
  doi?: string;
  pdfUrl?: string;
  tags?: string[];
  featured?: boolean;
}
