import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from '@angular/core';
import { AuthService } from "./auth.service";
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from "@angular/material/snack-bar";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getIsAuth();
    const accountType = this.authService.getAccountType();

    const role = route.queryParams['role'];
    let verticalPosition: MatSnackBarVerticalPosition = 'top';
    let horizontalPosition: MatSnackBarHorizontalPosition = 'right';

    if (!isAuth) {
      this.router.navigate(['/auth/login']);
      this.snackBar.open('Login to your account to access!', 'Close', { duration: 3000, panelClass: ['mat-toolbar', 'mat-warn'], horizontalPosition: horizontalPosition });
      return false;
    }

    if (role === 'Admin' && this.authService.getIsAuth()) {
      // If the user is an admin and is authenticated, allow access 
      return true;
    } else if (role === 'Admin') {
      // If the user is not authenticated but is trying to access the admin page, redirect to the login page
      this.snackBar.open('You are not allowed access!', 'Close', { duration: 3000, panelClass: ['mat-toolbar', 'mat-warn'], horizontalPosition: horizontalPosition});
      this.router.navigate(['/auth/login']);
      return false;
    } else {
      // For other roles (e.g., Customer), allow access
      return true;
    }

    return true;
  }
}
