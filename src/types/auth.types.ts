export interface AuthUser {
  id: number;
  username: string;
  email?: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  user?: AuthUser;
}
