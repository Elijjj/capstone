import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PaymentSuccessService } from './payment-success.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css'],
  providers: [PaymentSuccessService],
})
export class PaymentSuccessComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<boolean>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private selfService: PaymentSuccessService
  ) {}

  ngOnInit(): void {
    const orderId = this.activatedRoute.snapshot.params.orderId;
    this.selfService
      .updatePaymentStatus(orderId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
