import { Department } from "./Department";
import { UploadedFile } from "./UploadedFIle";
import User from "./User";

export interface Folder {
    id?: number;
    folder_name?: string;
    // local_path?: string;
    start_date?: string | null;
    end_date?: string | null;

    parent_id?: number;
    // department_id?: number[]
    department_id?: number;

    added_by?: User;

    status?: string;

    files?: UploadedFile[];
    file_uploads?: UploadedFile[];

    subfolders?: Folder[];
    downloadUrl?: string;

    // departments?: Department[];
    department?: Department;

    uploaded_files?: UploadedFile[];

    created_at?: string;

}