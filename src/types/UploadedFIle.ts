export interface UploadedFile {
    id?: number;
    filename: string;
    file: File;
    path?: string;
    mime_type?: string;
    size?: string;
    uploadable_type?: string;
    uploadable_id?: number;

    created_at: string;
}