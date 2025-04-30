import { Injectable } from "@angular/core";
import { User } from "../models/user";

@Injectable({ providedIn: 'root' })
export class UserService {
  
  private static userList: User[] = [];

  private currentUser: User | null = null;

  constructor() {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      UserService.userList = JSON.parse(savedUsers);
    }else {
      // if first run - create initial users
      UserService.userList = [
        {
          id: 12,
          email: 'soulytaire@gmail.com',
          password: "adminadmin123",
          name: 'Lala Lala',
          address: 'Belgrade, str. Mangi 5, apt.6, 23333',
          phone: '+38165684010',
          preferredCategories: ['manga']
        }
      ];
      localStorage.setItem('users', JSON.stringify(UserService.userList));
    }
    const savedCurrent = localStorage.getItem('currentUser');
    if (savedCurrent) {
      this.currentUser = JSON.parse(savedCurrent);
    }
  }
  
  getCurrentUser(): User | null {
    return this.currentUser;
  }
  getUser(email: string): User | undefined {
    return UserService.userList.find(u => u.email === email);
  }
  
  login(email: string, password: string): boolean {
    const user = UserService.userList.find(
      u => u.email === email && u.password === password
    );
    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user)); //save information about user
      return true;
    }
    return false;
  }
  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  //new user
  registerUser(user: User): User {
    //check if email has alredy used for account
    const existingUser = this.getUser(user.email);
    if (existingUser) {
      throw new Error('User with this email is already exist!');
    }

    const maxId = Math.max(...UserService.userList.map(u => u.id), 0);
    user.id = maxId + 1;
    UserService.userList.push(user);


    // update localStorage fully
    localStorage.setItem('users', JSON.stringify(UserService.userList));
    localStorage.setItem('currentUser', JSON.stringify(user));

    this.currentUser = user;
    return user;
  }

  // update profile
  updateCurrentUser(updated: User): void {
    const index = UserService.userList.findIndex(u => u.id === updated.id);
    if (index !== -1) {
      UserService.userList[index] = updated;
      this.currentUser = updated;
      
      localStorage.setItem('users', JSON.stringify(UserService.userList));
      localStorage.setItem('currentUser', JSON.stringify(updated)); // save to localStorage
    }
  }
  
  
}
