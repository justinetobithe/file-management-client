import User from './User';

export interface Mother {
  mother: {
    id: string;
    user_id: string;
    user?: User;
  };
}
export interface MotherPaginatedData {
  data: User[];
  meta: {
    last_page: number;
  };
}
