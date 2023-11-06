import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private isUserLoggedIn = false;
  private isAdminUser = false; 

  constructor(private authService: AuthService, private router: Router) {
    this.authService.autoAuthUser();
  }

  ngOnInit(): void {
    this.authService.autoAuthUser();
    // Subscribe to router events to check the current route
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkRoute(event.url);
      }
    });

    // Subscribe to authentication status changes
    this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.isUserLoggedIn = isAuthenticated;
      this.isAdminUser = this.authService.isAdminAccount();
      this.checkRoute(this.router.url); // Re-check the route on authentication changes
    });
  }

  // Check the route and hide header/footer for admin page
  private checkRoute(url: string) {
    const isAdminPage = url.startsWith('/admin');
    const header = document.querySelector('app-header');
    const footer = document.querySelector('app-footer');

    if (isAdminPage && this.isAdminUser) {
      // Hide header and footer on admin pages when logged in
      if(this.authService.getAccountType() === 'Admin'){
        this.hideHeaderAndFooter(header, footer);
      }
      this.hideHeaderAndFooter(header, footer);
    } else {
      // Show header and footer on other pages or when logged out
      this.showHeaderAndFooter(header, footer);
    }
  }

  private hideHeaderAndFooter(header: Element, footer: Element) {
    if (header) {
      header.classList.add('hidden');
    }

    if (footer) {
      footer.classList.add('hidden');
    }
  }

  private showHeaderAndFooter(header: Element, footer: Element) {
    if (header) {
      header.classList.remove('hidden');
    }

    if (footer) {
      footer.classList.remove('hidden');
    }
  }
  isAdminAccount() {
    // You can implement this based on your role logic
    return this.authService.getAccountType() === 'Admin';
  }
}
