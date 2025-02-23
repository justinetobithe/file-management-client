import { Department } from "./Department";
import { Designation } from "./Designation";

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

  department_id?: number;
  designation_id?: number;

  department?: Department;
  designation?: Designation;
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
