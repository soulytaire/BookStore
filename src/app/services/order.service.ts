import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { OrderedProduct } from '../models/ordered-product';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [];
  private currentId = 1;

  getOrdersForUser(userId: number): Order[] {
    return this.orders.filter(o => o.userId === userId);
  }


  addOrder(
    userId: number, 
    products: OrderedProduct[],
    location: { name: string; address: string },
    delivery: boolean, 
    payment: 'card' | 'cash' | 'online',
    deliveryFee:number = 0)
    : void {
    const newOrder: Order = {
      id: this.currentId++,
      userId,
      products,
      status: 'pending',
      timestamp: new Date(),
      location,
      delivery,
      payment,
      deliveryFee
    };
    this.orders.push(newOrder);

    // updating status of order
    setTimeout(() => {
      const order = this.orders.find(o => o.id === newOrder.id);
      if (order) order.status = 'processing';
    }, 60_000);

    
    setTimeout(() => {
      const order = this.orders.find(o => o.id === newOrder.id);
      if (order) order.status = 'completed';
    }, 120_000);
  }

  cancel(orderId: number): void {
    const order = this.orders.find(o => o.id === orderId);
    const confirmCancel = confirm(`Do you really want to cancel the order?`);
      if (!confirmCancel) 
        return;
      else
    if (order && (order.status === 'pending' || order.status === 'processing'))
      order.status = 'canceled';
    
  }

  rateOrder(orderId: number, rating: number): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order && order.status === 'completed') {
      order.rating = rating;
    }
  }

  deleteOrder(orderId: number, userId: number): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order && order.userId === userId && order.status !== 'completed') {
      this.orders = this.orders.filter(o => o.id !== orderId);
    }
  }
}
