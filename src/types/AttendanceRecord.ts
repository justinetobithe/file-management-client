import { Student } from "./Student";

export interface AttendanceRecord {
    id?: number;
    student_id: number;
    date: string;
    time_in: string;
    time_out: string;

    student?: Student;
}