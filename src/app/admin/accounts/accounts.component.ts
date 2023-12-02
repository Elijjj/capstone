import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { Accounts } from './accounts.model';
import { AccountsService } from './accounts.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css', '../admin-homepage.component.css'],
})
export class AccountsComponent implements OnInit, OnDestroy {
  accounts: Accounts[] = [];
  isLoading = false;
  private token: string;
  totalAccounts = 8;
  accountsPerPage = 8;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 8];
  selectedStatus = "";
  userId: string;
  userIsAuthenticated = false;
  private accountsSub: Subscription;
  private authStatusSub: Subscription;
  isMenuCollapsed = true; // Add this line

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    public accountsService: AccountsService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.accountsService.getAccounts(this.accountsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.accountsSub = this.accountsService
      .getAccountUpdateListener()
      .subscribe(
        (accountData: { accounts: Accounts[]; accountCount: number }) => {
          this.isLoading = false;
          this.totalAccounts = accountData.accountCount;
          this.accounts = accountData.accounts;
        }
      );
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.accountsPerPage = pageData.pageSize;
    this.accountsService.getAccounts(this.accountsPerPage, this.currentPage, this.selectedStatus);
}

  onStatusSelected(discountStatus: string) {
    this.isLoading = true;
    this.selectedStatus = discountStatus;
    this.currentPage = 1;
    this.accountsService.getAccounts(this.accountsPerPage, this.currentPage, this.selectedStatus);
}

  ngOnDestroy() {
    this.accountsSub.unsubscribe();
  }

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  onLogout() {
    this.authService.logout();
  }
}
