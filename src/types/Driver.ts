import { Vehicle } from "./Department";

export interface Driver {
    id?: number;
    first_name?: string;
    last_name?: string;
    name?: string;
    email: string;
    phone?: string;
    address?: string;
    // dob?: string;
    image?: string | null;
    role: string;
    token?: string;
    email_verified?: string

    vehicle?: Vehicle | null;
}