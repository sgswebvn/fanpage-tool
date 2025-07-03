export interface Package {
  _id: string;
  name: string;
  maxPages: number;
  price: number;
  customizable?: boolean;
}