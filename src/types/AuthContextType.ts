import { User, AppError, Result } from 'logic-qcm-plus';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<Result<void, AppError>>;
  logout: () => Promise<Result<void, AppError>>;
}
