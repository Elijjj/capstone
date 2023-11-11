import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ClientOrdersService } from './client-orders.service';

@Component({
  selector: 'app-client-orders',
  templateUrl: './client-orders.component.html',
  styleUrls: ['./client-orders.component.css'],
  providers: [ClientOrdersService],
})
export class ClientOrdersComponent implements OnInit {
  orders$!: Observable<any[]>;

  constructor(
    private selfService: ClientOrdersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.orders$ = this.selfService.getClientOrders$(
      this.authService.getUserId()
    );
  }

  getFormattedDate(dateString: string) {
    // Format the date and time
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options as any);
  }
}
