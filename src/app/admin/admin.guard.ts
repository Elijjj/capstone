// Auth Guard for admin routes (admin-auth.guard.ts)
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  canActivate(): boolean {
    let horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    const userRole = this.authService.getAccountType();
    if (userRole === 'Admin') {
      this.snackBar.open('Welcome Admin!', 'Close', { duration: 3000 });
      return true; // Allow access to admin routes
    } else {
      this.snackBar.open('You do not have access!', 'Close', { duration: 3000, panelClass: ['mat-toolbar', 'mat-warn'], horizontalPosition: horizontalPosition });
      this.router.navigate(['/']); // Redirect to customer dashboard or another page
      return false;
    }
  }
}
