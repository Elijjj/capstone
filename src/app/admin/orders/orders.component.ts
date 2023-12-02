import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { OrdersService } from './orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css', '../admin-homepage.component.css'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  isLoading = false;
  private token: string;
  isMenuCollapsed = true;
  selectedStatus: string = 'ALL'; // Default to 'All'

  selectedMonth: number = new Date().getMonth() + 1; // Current month by default
  selectedYear: number = new Date().getFullYear(); // Current year by default

  orders$!: Observable<any[]>;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private ordersService: OrdersService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      this.isLoading = false;
    });

    this.fetchOrders();
  }

  ngOnDestroy() {}

  onDeleteOrder(orderId: string) {
    if (confirm('Are you sure you want to delete this order?')) {
      this.ordersService.deleteProduct(orderId).subscribe({
        next: () => {
          // Optionally refresh the list or remove the item from the view
          this.fetchOrders(); // Refresh the list
        },
        error: (err) => {
          console.error('Error deleting order:', err);
          // Handle error (show user a message, etc.)
        }
      });
    }
  }

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  onLogout() {
    this.authService.logout();
  }

  onMonthChange(event: any) {
    this.selectedMonth = event as number;
    this.fetchOrders();
  }

  onYearChange(event: any) {
    this.selectedYear = event as number;
    this.fetchOrders();
  }

  onStatusChange(status: string) {
    this.selectedStatus = status;
    console.log("Selected Status:", this.selectedStatus); 
    this.fetchOrders();
  }

  getFormattedDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', // or '2-digit'
      month: 'long', // could be 'numeric', '2-digit', or 'narrow'
      day: 'numeric', // or '2-digit'
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  onUpdateDeliveryStatus(orderId: string, status: string) {
    const confirmationMessage = `Are you sure you want to mark this order as '${status}'?`;
    if (confirm(confirmationMessage)) {
      this.ordersService.updateDeliveryStatus(orderId, status)
        .pipe(
          switchMap(async() => this.fetchOrders()) // Refresh the list after updating
        )
        .subscribe({
          next: () => {
            console.log('Delivery status updated successfully');
          },
          error: (err) => {
            console.error('Error updating delivery status:', err);
          }
        });
    }
  }

  onCompleteOrder(orderId: string) {
    const confirmationMessage = 'Are you sure you want to mark this order as COMPLETED?';
    if (confirm(confirmationMessage)) {
      this.ordersService.updateOrderStatus(orderId, 'COMPLETED')
        .pipe(
          switchMap(async() => this.fetchOrders()) // Refresh the list after updating
        )
        .subscribe({
          next: () => {
            console.log('Order status updated to COMPLETED successfully');
          },
          error: (err) => {
            console.error('Error updating order status:', err);
          }
        });
    }
  }

  private fetchOrders() {
    // Create a date object at the start of the selected month
    const date = new Date(this.selectedYear, this.selectedMonth - 1);

    // Adjust for the time zone offset
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

    // Convert to ISO string
    const monthYearDate = date.toISOString();

    this.orders$ = this.ordersService.getAllOrders$(monthYearDate, this.selectedStatus);
}
}
