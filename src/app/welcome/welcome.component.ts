import { Component } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';

import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-welcome',
  standalone: false,
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  products: Product[] = [];
  
    filters = {
      name: '',
      author: '',
      languages: [] as string[],
      minPrice: 0,
      maxPrice: 1000,
      category: [] as string[],
      rating: 0,
    };
    availableCategories = ['classical', 'fictional literature', 'scifi', 'fairytales','romance','adventures', 'manga'];

    constructor(
      private productService: ProductService,
      private router: Router,
      private cartService: CartService,
      private userService: UserService,
      private snackBar: MatSnackBar) {
      
        this.products = this.productService.getProducts();
    }
  
    ngOnInit(): void {
      const user = this.userService.getCurrentUser();
      if (user?.preferredCategories?.length) {
        this.filters.category = [...user.preferredCategories];
      }
    }

    formatPrice(value: number): string {
      return `${value}€`;
    }
    
    setRatingFilter(rating: number): void {
      this.filters.rating = rating;
    }

    maxSliderPrice: number = 1000;

    updateMaxPrice(): void {
      this.filters.maxPrice = this.maxSliderPrice;
    }
    
  
    getRating(reviews: { rating: number }[]): number {
      return this.productService.getRating(reviews);
    }
    goToDetail(productId: string): void {
      this.router.navigate(['/product', productId]);
    }
    addToCart(product: Product, event: MouseEvent): void {
      event.stopPropagation();
      this.showQuantityMap[product.id] = true;
      this.quantityMap[product.id] = 1;
    }
    
    confirmAdd(product: Product): void {
      const quantity = this.quantityMap[product.id] || 1;
      this.cartService.addToCart(product.id, product.name, product.price, quantity);
      this.showQuantityMap[product.id] = false;

      this.snackBar.open(`${product.name} x${quantity} added to cart!`, 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['snackbar-success']
      });
    }
    
    
    showQuantityMap: { [id: string]: boolean } = {};
    quantityMap: { [id: string]: number } = {};


    sortBy: string = 'default'; // 'default', 'priceAsc', 'priceDesc', 'rating', 'name'

    
    resetFilters(): void {
      this.filters = {
        name: '',
        author: '',
        languages: [],
        minPrice: 0,
        maxPrice: 1000,
        category: [],
        rating: 0
      };
    }
    
    applyPreferredGenres(): void {
      const user = this.userService.getCurrentUser();
      if (user?.preferredCategories?.length) {
        this.filters.category = [...user.preferredCategories];
      }
    }
    
    getFilteredProducts(): Product[] {
      let filtered = this.products.filter(p =>
        p.name.toLowerCase().includes(this.filters.name.toLowerCase()) &&
        p.author.toLowerCase().includes(this.filters.author.toLowerCase()) &&
        (this.filters.languages.length === 0 || this.filters.languages.includes(p.language)) &&
        p.price >= this.filters.minPrice &&
        p.price <= this.filters.maxPrice &&
        (this.filters.category.length === 0 || this.filters.category.some(cat => p.category.includes(cat))) &&
        this.getRating(p.reviews) >= this.filters.rating
      );
      
      // sorting by
      switch (this.sortBy) {
        case 'priceAsc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'priceDesc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => this.getRating(b.reviews) - this.getRating(a.reviews));
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
      
      return filtered;
    }

  }
