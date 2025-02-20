import { Department } from "./Department";
import { UploadedFile } from "./UploadedFIle";

export interface Folder {
    id?: number;
    folder_name?: string;
    local_path?: string;
    start_date?: string | null;
    end_date?: string | null;

    parent_id?: number;
    department_id?: number[];

    files?: UploadedFile[];

    subfolders?: Folder[];
    downloadUrl?: string;

    departments?: Department[];

    uploaded_files?: UploadedFile[];

    created_at?: string;

}