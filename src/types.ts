export interface ChangesetEntry {
  id: string;
  type: 'patch' | 'minor' | 'major';
  message: string;
  timestamp: string;
  author?: string;
}

export interface ChangesetFile {
  id: string;
  type: 'patch' | 'minor' | 'major';
  message: string;
  timestamp: string;
  author?: string;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    patch: string[];
    minor: string[];
    major: string[];
  };
}

export interface ChangelogConfig {
  title?: string;
  description?: string;
  format?: 'markdown' | 'json';
} 