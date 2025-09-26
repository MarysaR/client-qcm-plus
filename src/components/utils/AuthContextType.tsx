import { TokenClaims } from 'logic-qcm-plus';

export interface AuthContextType {
  token: string | null;
  claims: TokenClaims | null;
  login: (token: string, claims: TokenClaims) => Promise<void>;
  logout: () => void;
}
