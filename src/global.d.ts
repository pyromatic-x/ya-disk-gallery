import { TUser } from "./app/api/auth/login/route";

declare global {
  interface Window {
    onTelegramAuth?: (user: TUser) => void;
  }
}