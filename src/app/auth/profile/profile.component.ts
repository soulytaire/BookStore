import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: User;
  categories = ['manga', 'fictional literature', 'scifi', 'fairytales', 'romance', 'adventures'];

  constructor(private userService: UserService, private snackBar: MatSnackBar) {
    this.user = { ...this.userService.getCurrentUser()! };
  }
  isEditing = false;

  edit(): void {
    this.isEditing = true;
  }
  //validations
  validateEmail(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(this.user.email);
  }
  validateName(): boolean {
    if (!this.user.name) return false;
    const nameRegex = /^(?:[A-Z][a-zA-Z'.-]*\s)*[A-Z][a-zA-Z'.-]*$/;
    return nameRegex.test(this.user.name.trim());
  }
  validatePhone(): boolean{
    if (!this.user.phone) return false;
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4,6}$/;
    return phoneRegex.test(this.user.phone);
  }
  save(): void {
    if (!this.user.email) {
      this.snackBar.open("Email is invalid format.", 'OK', {duration: 3000, panelClass: ['snackbar-error']});
      return;
    }
    if(!this.validateEmail()){
      this.snackBar.open('Please enter a valid email address.', 'OK', {duration: 3000, panelClass: ['snackbar-error']});
      return;
    }


    if(!this.validatePhone()){
      this.snackBar.open('Please enter a valid phone number.','OK',{duration: 3000, panelClass: ['snackbar-error']});
      return;
    }

    if (!this.user.name || !this.validateName()) {
      this.snackBar.open('Name should start with a capital letter and contain at least two parts.','OK',{duration: 3000, panelClass: ['snackbar-error']});
      return;
    }
    this.userService.updateCurrentUser(this.user);
    this.isEditing = false;
    alert('Profile was updated!');
  }

}
