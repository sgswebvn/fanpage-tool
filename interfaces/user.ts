export interface User {
  _id: string;
  email: string;
  name: string;
  role: "admin" | "user" | "guest";
  facebookId?: string;
  isActive?: boolean;
}