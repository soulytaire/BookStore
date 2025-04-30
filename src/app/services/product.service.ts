import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Review } from '../models/review';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

    private products: Product[] = [ 
    { id: '000001', 
        name: 'Solo leveling vol.1', 
        category: ['manga', 'fantasy'],
        description:'song jinwu',
        author:'Chugong', 
        publisher: 'D&C', 
        language: 'english', 
        imageUrl: 'assets/img/solo_leveling_vol_1_manhwa.jpg', 
        price: 15,
        reviews:[{ userId:123456, userName:'MyApolo', rating: 5, comment: 'Amazing!', date: new Date() },
            { userId:612345, userName:'Ghoulle', rating: 3, comment: 'okay', date: new Date()}]
      },
      {
        id: '000002', 
        name: 'Solo leveling vol.2', 
        category: ['manga', 'adventures'],
        description:'song jinwu',
        author:'Chugong', 
        publisher: 'Isatari-comics', 
        language: 'russian', 
        /* ?Can't find image, why?? */
        imageUrl: 'assets/img/solo_leveling_vol_1_manhwa.jpg', 
        price: 13,
        reviews:[{ userId:123457, userName:'OlopaYm', rating: 5, comment: 'Its the masterpiece!', date: new Date() }]
      },
      {
        id: '000003', 
        name: 'Omniscient Reader vol.1', 
        category: ['manga', 'adventures', 'fictional literature'],
        description:'song jinwu',
        author:'Sing Shong', 
        publisher: 'Isatari-comics', 
        language: 'korean', 
        imageUrl: 'assets/img/solo_leveling_vol_1_manhwa.jpg', 
        price: 13,
        reviews:[{ userId:123457, userName:'OlopaYm', rating: 5, comment: 'Nice!', date: new Date() }]
      }
   ];

  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  addReview(productId: string, review:Review): void {
    const product = this.products.find(p => p.id === productId);
    if (!product){
      console.warn(`Product with ID ${productId} not found`);
      return;
    } 
    product.reviews.push({
        ...review, date: new Date()
      });
  }
  hasUserReviewed(productId: string, userId: number): boolean {
    const product = this.products.find(p => p.id === productId);
    return product?.reviews.some(r => r.userId === userId) ?? false;
  }
  
  getRating(reviews: { rating: number }[]): number {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  }
}
