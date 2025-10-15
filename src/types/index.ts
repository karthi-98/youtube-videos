export interface VideoDocument {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  categories: string[];
}

export interface YouTubeLink {
  id: string;
  url: string;
  title: string;
  addedAt: string;
  watched: boolean;
  category?: string;
}

export interface VideoDocumentWithLinks extends VideoDocument {
  links: YouTubeLink[];
}

export type CreateYouTubeLinkInput = Omit<YouTubeLink, 'id' | 'addedAt' | 'watched'>;
