
import { Review } from './review';
export interface Product {
    id: string;
    name: string;
    category: string[];
    description: string;
    author: string;
    publisher: string;
    language: string;
    imageUrl: string;
    price: number;
    reviews: Review[];
  }