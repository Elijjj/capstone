import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable()
export class PaymentSuccessService {
  constructor(private http: HttpClient) {}

  updatePaymentStatus(
    orderId: string,
    payload: { productUpdates: { productId: string; quantity: number }[] }
  ) {
    return this.http.put(`${environment.apiUrl}/checkout/${orderId}`, payload);
  }

  getOrderByOrderId$(orderId: string): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/checkout?orderId=${orderId}`)
      .pipe(map((res: { message: string; order: any }) => res.order as any));
  }
}
