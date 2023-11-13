import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AdminHomepageService } from './admin-homepage.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin-homepage.component.html',
  styleUrls: ['./admin-homepage.component.css'],
})
export class AdminHomepageComponent implements OnInit, OnDestroy {
  isLoading = false;
  private token: string;
  private role: string;
  authData: string;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;
  isMenuCollapsed = true; // Add this line

  ordersCount$!: Observable<number>;
  deliveryCount$!: Observable<number>;
  pickUpCount$!: Observable<number>;
  productsCount$!: Observable<number>;
  adminCount$!: Observable<number>;
  totalSaleThisMonth$!: Observable<number>;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private selfService: AdminHomepageService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    if (!this.authData) {
      this.isLoading = false;
    }
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
        this.userIsAuthenticated = authStatus;
      });

    this.ordersCount$ = this.selfService.getOrdersCount$();
    this.deliveryCount$ = this.selfService.getDeliveryOrdersCount$();
    this.pickUpCount$ = this.selfService.getPickUpOrdersCount$();
    this.productsCount$ = this.selfService.getAvailableProducts$();
    this.adminCount$ = this.selfService.getAdminAccountCount$();
    this.totalSaleThisMonth$ = this.selfService.getTotalSalesPerMonth$();
  }

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  ngOnDestroy() {}

  onLogout() {
    this.authService.logout();
  }
}
