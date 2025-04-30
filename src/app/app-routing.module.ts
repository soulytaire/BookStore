import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { CartComponent } from './cart/cart.component';
import { OrderListComponent } from './orders/order-list.component';
import { ProductComponent } from './product/product.component';
import { ProfileComponent } from './auth/profile/profile.component';

const routes: Routes = [
  
  {path: 'signup', component: SignupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'cart', component: CartComponent},
  {path: 'orders', component: OrderListComponent},
  {path: '', component: WelcomeComponent},
  {path: 'product/:id', component: ProductComponent},
  {path: 'profile', component: ProfileComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
