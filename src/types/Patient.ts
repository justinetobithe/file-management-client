import { MediaFile } from './MediaFile';
import User from './User';

export interface Patient extends User {
  mother: {
    id: string;
    user_id: string;
    media_files: MediaFile[];
  };
}

export interface PatientPaginatedData {
  data: Patient[];
  meta: {
    last_page: number;
  };
}
