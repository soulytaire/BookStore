import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { CartService } from '../services/cart.service';
@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  product!: Product;
  quantity = 1;
  showQuantity = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const p = this.productService.getProductById(id);
      if (p) this.product = p;
    }
  }

  startAdding(): void {
    this.showQuantity = true;
  }
  confirmAdd(): void {
    this.cartService.addToCart(this.product.id, this.product.name, this.product.price, this.quantity);
    this.showQuantity = false;
  }
  getRating(reviews: { rating: number }[]): number {
    return this.productService.getRating(reviews);
  }
}
