export interface InformativeVideo {
  id: string;
  title: string;
  link: string;
  created_at: string;
}

export interface InformativeVideoPaginatedData {
  data: InformativeVideo[];
  last_page: number;
}
