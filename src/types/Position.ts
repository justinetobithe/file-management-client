import { Department } from "./Department";
import { Designation } from "./Designation";
import User from "./User";

export interface Position {
    id?: number;
    user_id?: number | null;
    department_id?: number;
    designation_id?: number | null;
    section_head?: number | boolean;

    user?: User;
    department?: Department;
    designation?: Designation;
}