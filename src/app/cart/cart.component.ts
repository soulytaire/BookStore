import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { OrderedProduct } from '../models/ordered-product';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  userId: number = 1; 
  cartItems: OrderedProduct[] = []; 
  userName: string = '';
  address: string = '';
  paymentMethod!: 'card' | 'cash' | 'online';
  isConfirmed: boolean = false;

  delivery: boolean = true; // true = delivery
  deliveryFee: number = 5;
  minFreeDeliveryAmount: number = 50;


  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    if (!this.userService.getCurrentUser()) {
      this.snackBar.open('To create an order, you need to log into your account or register.', 'OK', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['snackbar-error']
      });
      this.router.navigate(['/login']);
      return;
    }
    
    this.cartItems = this.cartService.getCartItems();
    const user = this.userService.getCurrentUser();

    if (user) {
      this.userId = user.id;
      this.userName = user.name;
      this.address = user.address || '';
    }
  }
  confirmCart(): void {
    this.isConfirmed = true;
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
    this.cartItems = this.cartService.getCartItems();
  }

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

    // price without delivery
  getSubtotal(): number {
    return this.cartService.getTotalPrice();
  }


  getDeliveryFee(): number {
    const subtotal = this.getSubtotal();
    if (!this.delivery) 
      return 0; // pickup = 0

    if (subtotal > 0 && subtotal < this.minFreeDeliveryAmount)
      return this.deliveryFee;
    
    return 0;
  }

  // Total amount: items + shipping
  getTotalWithDelivery(): number {
    return this.getSubtotal() + this.getDeliveryFee();
  }
checkout(): void {

  const total = this.cartService.getTotalPrice();
  let deliveryFee = this.getDeliveryFee();

  try {

    if (this.cartItems.length === 0){
      this.snackBar.open("You have no items in your cart...", 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['snackbar-error']
      });
      
      this.router.navigate(['']);
      return;
    }

    if (!this.userName) {
      //throw new Error('Please enter your name.');
      this.snackBar.open("Please enter your name.", 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['snackbar-error']
      });
      return;
    }

    if (this.delivery) {
      if (!this.address) {
        //throw new Error('Please fill in your shipping address.');
        this.snackBar.open("Please fill in your shipping address.", 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
        return;
      }

    if (!this.paymentMethod) {
      this.snackBar.open('Please select a payment method.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['snackbar-error']
      });
      return;
    }

    if (total < this.minFreeDeliveryAmount && this.cartItems.length !== 0) {
      const confirmExtra = confirm(`Sum of order less than ${this.minFreeDeliveryAmount}€. Delivery service will add +${this.deliveryFee}€. Do you want to proceed?`);
      if (!confirmExtra) 
        return;
    } else {
      this.address = 'Pickup';
      deliveryFee = 0; // if pickup — no delivery
    }

    
    
  }

  //
  this.orderService.addOrder(
    this.userId, 
    this.cartItems,
    { name: this.userName, address: this.address},
    this.delivery,
    this.paymentMethod,
    deliveryFee
  );

  this.cartService.clearCart();
  this.cartItems = [];
  this.snackBar.open('Order is created!', 'Close', {
    duration: 3000,
    verticalPosition: 'top',
    panelClass: ['snackbar-success']
  });

  
  this.router.navigate(['/orders']);
  
}catch (error: any) {
  this.snackBar.open('Error occur when create the order: ' + error.message, 'Close', {
    duration: 3000,
    verticalPosition: 'top',
    panelClass: ['snackbar-error']
  });
}
 
  
}

}
