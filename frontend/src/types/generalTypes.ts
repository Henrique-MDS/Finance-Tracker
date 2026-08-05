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
  code: string;
  icon: string;
  system: boolean;
  created_at: string;
  id: string;
  name: string;
  updated_at: string;
  user_id: string;
}

export  type Goal = {
  creation_date: string;
  goal_value: number;
  icon: string | null;
  id: string;
  limit_date: string;
  now_value: number;
  status: string;
  title: string;
  user_id: string;
}