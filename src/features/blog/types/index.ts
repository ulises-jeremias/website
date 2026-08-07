export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  draft: boolean;
}

export interface BlogPostPreview {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
}
