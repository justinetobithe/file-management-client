import { Department } from "./Department";

// MAIN
export default interface User {
  id: string;
  first_name: string;
  last_name: string;
  name?: string;
  email: string;
  phone?: string;
  address?: string;
  // dob?: string;
  image?: string | null;
  role: string;
  token?: string;
  email_verified?: Date | null;
  status?: number;

  department?: Department;
}


export interface UserPaginatedData {
  data: User[];
  last_page: number;
}

// STATE
export interface UserStateDefinition {
  data: User | null;
}

// ACTIONS
export interface UserStateActions {
  setUser: (user: User) => void;
}
