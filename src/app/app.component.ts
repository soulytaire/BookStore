import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  constructor(public userService: UserService, private router: Router) {}
  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
  title = 'app-store';
}
