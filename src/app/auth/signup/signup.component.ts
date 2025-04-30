import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  user: User = {
    id: 0,
    password: '',
    name: '',
    address: '',
    email: '',
    phone: '',
    preferredCategories: []
  };
  categories = ['manga', 'fictional literature', 'scifi', 'fairytales','romance','adventures'];

  constructor(
    private userService: UserService, 
    private router: Router) {}

    validateEmail(): boolean {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; //user.name.23@example.co.uk
      return emailRegex.test(this.user.email);
    }
    validateName(): boolean {
      if (!this.user.name) return false;
      const nameRegex = /^(?:[A-Z][a-zA-Z'.-]*\s)*[A-Z][a-zA-Z'.-]*$/; //names with 2+ words, allowing ', -, and . (Mary J. O'Neil)
      return nameRegex.test(this.user.name.trim());
    }
    validatePhone(): boolean{
      if (!this.user.phone) return false;
      const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4,6}$/;
      return phoneRegex.test(this.user.phone);
    }

  register(): void {
    if (!this.user.email) {
      alert("Email is invalid format.");
      return;
    }
    if(!this.validateEmail()){
      alert('Please enter a valid email address.');
      return;
    }

    if (!this.user.name || !this.validateName()) {
      alert("Name should start with a capital letter and contain at least two parts.");
      return;
    }
    
    if(this.user.phone && !this.validatePhone()){
      alert('Please enter a valid phone number.');
      return;
    }
    if (this.user.password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }
    this.userService.registerUser(this.user);
    this.userService.login(this.user.email, this.user.password);
    this.router.navigate(['']);
  }

}
