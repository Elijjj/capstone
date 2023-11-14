import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ReportsService } from './reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css', '../admin-homepage.component.css'],
})
export class ReportsComponent implements OnInit, OnDestroy {
  isLoading = false;
  private token: string;
  isMenuCollapsed = true; // Add this line

  monthlyCustomers$!: Observable<number>;
  mostFrequentCustomer$!: Observable<string>;
  mostBoughtProduct$!: Observable<string>;

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

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  ngOnDestroy() {}

  onLogout() {
    this.authService.logout();
  }

  onMonthChange(event: any) {
    const monthDate = this.getDateFromMonth(event as number);
    this.setReportsData(monthDate);
  }

  getDateFromMonth(month: number): string {
    // Create a new Date object with the current year and the specified month
    const currentDate = new Date();
    currentDate.setMonth(month - 1); // Months in JavaScript are zero-based, so subtract 1

    return currentDate.toLocaleDateString();
  }

  setReportsData(monthDate: string): void {
    this.monthlyCustomers$ = this.selfService.getMonthlyCustomers$(monthDate);

    this.mostFrequentCustomer$ =
      this.selfService.getMostFrequentCustomer$(monthDate);

    this.mostBoughtProduct$ = this.selfService.getMostBoughtProduct$(monthDate);
  }
}
