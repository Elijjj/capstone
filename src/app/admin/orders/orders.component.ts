import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ReportsService } from './orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css', '../admin-homepage.component.css'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  isLoading = false;
  private token: string;
  isMenuCollapsed = true; // Add this line

  orders$!: Observable<any[]>;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private selfService: ReportsService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      this.isLoading = false;
    });

    this.onMonthChange(1);
  }

  ngOnDestroy() {}

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  onLogout() {
    this.authService.logout();
  }

  getFormattedDate(dateString: string) {
    // Format the date and time
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options as any);
  }

  onMonthChange(event: any) {
    const monthDate = this.getDateFromMonth(event as number);
    this.setOrdersData(monthDate);
  }

  private getDateFromMonth(month: number): string {
    // Create a new Date object with the current year and the specified month
    const currentDate = new Date();
    currentDate.setMonth(month - 1); // Months in JavaScript are zero-based, so subtract 1

    return currentDate.toLocaleDateString();
  }

  private setOrdersData(monthDate: string): void {
    this.orders$ = this.selfService.getAllOrders$(monthDate);
  }
}
