export interface User {
  id: number;
  password: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  preferredCategories?: string[];
}