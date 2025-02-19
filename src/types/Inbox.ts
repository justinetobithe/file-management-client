export interface Inbox {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface InboxPaginatedData {
  data: Inbox[];
  last_page: number;
}
