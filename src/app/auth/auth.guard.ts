import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from '@angular/core';
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getIsAuth();
    const accountType = this.authService.getAccountType();

    const role = route.queryParams['role'];

    if (!isAuth) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    if (role === 'Admin' && this.authService.getIsAuth()) {
      // If the user is an admin and is authenticated, allow access 
      return true;
    } else if (role === 'Admin') {
      // If the user is not authenticated but is trying to access the admin page, redirect to the login page
      this.router.navigate(['/auth/login']);
      return false;
    } else {
      // For other roles (e.g., Customer), allow access
      return true;
    }

    return true;
  }
}
