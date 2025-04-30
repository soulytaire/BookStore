import { Injectable } from '@angular/core';
import { OrderedProduct } from '../models/ordered-product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: OrderedProduct[] = [];

  getCartItems(): OrderedProduct[] {
    return this.cartItems;
  }

  addToCart(productId: string, name: string, price: number, quantity: number): void {
    const existingItem = this.cartItems.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ productId, name, price, quantity });
    }
  }
  updateQuantity(productId: string, quantity: number): void {
    const item = this.cartItems.find(i => i.productId === productId);
    if (item) item.quantity = quantity;
  }

  removeFromCart(productId: string): void {
    this.cartItems = this.cartItems.filter(item => item.productId !== productId);
  }

  clearCart(): void {
    this.cartItems = [];
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
