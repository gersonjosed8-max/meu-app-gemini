
export enum UserRole {
  ADMIN = 'ADMIN',
  TRANSLATOR = 'TRANSLATOR',
  REVIEWER = 'REVIEWER',
  CONSULTANT = 'CONSULTANT',
  READER = 'READER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  approved: boolean;
}

export interface ExportHistoryItem {
  id: string;
  fileName: string;
  format: string;
  timestamp: number;
  chapter: number;
  status: 'SUCCESS' | 'FAILED';
}

export interface GlossaryTerm {
  id?: string;
  pt?: string;
  koti?: string;
  term?: string;
  definition?: string;
  originalWord?: string;
}

export interface TranslationSegment {
  id: string;
  source: string;
  target: string;
  chapter: number;
  lastUsed: number;
}

export interface InterlinearWord {
  original: string;
  gloss: string;
  morphology?: string;
  strongs?: string;
}

export interface Metaphor {
  id: string;
  title: string;
  psalmReference: string;
  literalMeaning: string;
  symbolicMeaning: string;
  kotiEquivalent: string;
  category: 'Natureza' | 'Realeza' | 'Guerra' | 'Cotidiano';
}

export interface Verse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  original: string;
  reference: string;
  translation: string;
  culturalNotes?: string;
  markers: string[];
}
