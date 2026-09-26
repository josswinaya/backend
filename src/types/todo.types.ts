export interface TodoRecord {
  id: number;
  user_id: number;
  task: string;
  is_completed: boolean | number;
}

export interface TodoItem {
  id: number;
  task: string;
  is_completed: boolean;
  userId?: number;
}

export interface CreateTodoInput {
  task: string;
}

export interface UpdateTodoInput {
  task?: string;
  is_completed?: boolean;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}
