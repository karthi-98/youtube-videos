export interface VideoDocument {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface YouTubeLink {
  id: string;
  url: string;
  title: string;
  addedAt: Date;
  watched: boolean;
}

export interface VideoDocumentWithLinks extends VideoDocument {
  links: YouTubeLink[];
}

export type CreateYouTubeLinkInput = Omit<YouTubeLink, 'id' | 'addedAt' | 'watched'>;
