import { OrderedProduct } from './ordered-product';

export interface Order {
    id: number;
    userId: number;
    products: OrderedProduct[];
    status: 'pending' | 'processing' | 'completed'  | 'canceled';
    timestamp: Date;
    location: {
      name: string;
      address: string;
    };
    delivery: boolean;
    payment: 'card' | 'cash' | 'online';
    rating?:number;
    deliveryFee?: number; 
  }
  