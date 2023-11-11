import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';

@Injectable()
export class PaymentSuccessService {
  constructor(private http: HttpClient) {}

  updatePaymentStatus(orderId: string) {
    return this.http.put(`${environment.apiUrl}/checkout/${orderId}`, {});
  }
}
