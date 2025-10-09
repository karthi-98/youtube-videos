export interface VideoDocument {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface YouTubeLink {
  id: string;
  url: string;
  title: string;
  addedAt: string;
  watched: boolean;
}

export interface VideoDocumentWithLinks extends VideoDocument {
  links: YouTubeLink[];
}

export type CreateYouTubeLinkInput = Omit<YouTubeLink, 'id' | 'addedAt' | 'watched'>;
