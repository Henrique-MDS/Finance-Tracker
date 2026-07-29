export type DataResponse = {
    success: boolean;
    message: string;
    data?: any[];
    name?: string;
    email?: string;
    error?: any;
}

export type UserProfile = {
    avatar_url: string;
    created_at: string;
    id: string;
    name: string;
}

export  type Category = {
  created_at: string;
  id: string;
  name: string;
  updated_at: string;
  user_id: string;
}