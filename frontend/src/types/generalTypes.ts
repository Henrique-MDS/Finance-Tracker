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

export type FilterTransactions = {
  user_id: string;
  type: string | null;
  iniDate: string | null;
  finalDate: string | null;
  catId: string | null;
}

export type RecurrentTable = {
  active: boolean;
  auto_generate: boolean;
  category_id: string;
  created_at: string;
  desc: string;
  end_date: string | null;
  execution_time: string | null;
  frequency: string;
  id: string
  last_execution: string | null
  next_execution: string | null
  type: string
  user_id: string;
value: number;
}