import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, of, switchMap, takeUntil } from 'rxjs';
import { PaymentSuccessService } from './payment-success.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css'],
  providers: [PaymentSuccessService],
})
export class PaymentSuccessComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<boolean>();

  isLoading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private selfService: PaymentSuccessService
  ) {}

  ngOnInit(): void {
    const orderId = this.activatedRoute.snapshot.params.orderId;

    this.selfService
      .getOrderByOrderId$(orderId)
      .pipe(
        switchMap((order) => {
          if (order.orderStatus === 'CONFIRMED') {
            return of(true);
          }

          const items = order.cartItems.map((item) => {
            return {
              productId: item.productId,
              quantity: item.quantity,
            };
          });
          let payload = {
            productUpdates: items,
          };

          return this.selfService.updatePaymentStatus(orderId, payload);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => (this.isLoading = false));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
