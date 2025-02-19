import { Strand } from "./Strand";
import User from "./User";

export interface Student {
    id?: number;
    user_id: number;
    strand_id: number;
    student_number: string;

    user?: User;
    strand?: Strand;
}