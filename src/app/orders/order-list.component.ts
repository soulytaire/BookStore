import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-order-list',
  standalone: false,
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  userId: number = 0;
  constructor(private orderService: OrderService,
    private userService: UserService,
    private productService: ProductService,
    private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const user = this.userService.getCurrentUser();
    if (user) {
      this.userId = user.id;
      this.orders = this.orderService.getOrdersForUser(user.id);
      this.sortOrdersByStatus();
      this.orders.forEach(order => {
        order.products.forEach(item => {
          this.reviewMap[item.productId] = { rating: 5, comment: '' };
        });
      });
    }

    
  }
  getTotal(order: Order): number {
    const subtotal = order.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    return subtotal + (order.deliveryFee || 0);
  }

  cancelOrder(orderId: number): void {
    this.orderService.cancel(orderId);
    this.orders = this.orderService.getOrdersForUser(this.userId);
    this.sortOrdersByStatus();
  }
  statusClass(status: string): string {
    return {
      completed: 'status-completed',
      canceled: 'status-canceled'
    }[status] || '';
  }


  activeOrders: Order[] = [];
completedOrders: Order[] = [];
canceledOrders: Order[] = [];

sortOrdersByStatus(): void {
  this.activeOrders = this.orders.filter(o => o.status === 'pending' || o.status === 'processing');
  this.completedOrders = this.orders.filter(o => o.status === 'completed');
  this.canceledOrders = this.orders.filter(o => o.status === 'canceled');
}

reviewMap: { [productId: string]: { rating: number; comment: string } } = {};

submitReview(productId: string): void {
  const review = this.reviewMap[productId];
  const user = this.userService.getCurrentUser();
  if (!user) return;

  if (this.productService.hasUserReviewed(productId, user.id)) {
    this.snackBar.open('You have already reviewed this product.', 'Close', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
    return;
  }
  this.productService.addReview(productId, {
    userId: user.id,
    userName: user.name,
    rating: review.rating,
    comment: review.comment,
    date: new Date()
  });

  this.snackBar.open('Thank you for your review!', 'Close', {
    duration: 3000,
    panelClass: ['snackbar-success']
  });

  this.reviewMap[productId] = { rating: 5, comment: '' };
}

}
