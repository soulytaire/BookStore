import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  errorExists = false;
  errorText = "";

  constructor(private userService: UserService, private router: Router) {}
 
  onSubmit(form: NgForm): void {
    const email = form.value.email;
    const password = form.value.password;
  
    const success = this.userService.login(email, password);
    if (success) {
      this.router.navigate(['']);
    } else {
      this.errorExists = true;
      this.errorText = "Incorrect login or password";
    }
  }
  
  
}
