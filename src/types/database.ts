export type Role = 'ceo' | 'developer';

export type FileType = 'pdf' | 'image' | 'video' | 'note';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar_url: string | null;
}

export interface Submission {
  id: string;
  developer_id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  file_type: FileType;
  status: SubmissionStatus;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id'> & { id?: string };
        Update: Partial<Profile>;
      };
      submissions: {
        Row: Submission;
        Insert: Omit<Submission, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Submission>;
      };
    };
  };
}
