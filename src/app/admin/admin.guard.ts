// Auth Guard for admin routes (admin-auth.guard.ts)
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const userRole = this.authService.getAccountType();
    if (userRole === 'Admin') {
      return true; // Allow access to admin routes
    } else {
      this.router.navigate(['/']); // Redirect to customer dashboard or another page
      return false;
    }
  }
}
