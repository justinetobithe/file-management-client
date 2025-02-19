export interface MediaFile {
  id: number;
  name: string;
  url: string;
  size: number;
  type: string;
  created_at: string;
}

export interface MediaFilePaginatedData {
  data: MediaFile[];
  meta: {
    last_page: number;
  };
}
