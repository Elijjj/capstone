import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  getAllOrders$(monthYearDate: string, status: string): Observable<any> {
    // Construct the query parameters
    let queryParams = `date=${monthYearDate}`;
    if (status) {
      queryParams += `&orderStatus=${status}`;
    }

    return this.http
      .get(`${environment.apiUrl}/checkout/getAll?${queryParams}`)
      .pipe(map((res: { message: string; order: any }) => res.order as any[]));
  }

  deleteProduct(orderId: string) {
    return this.http.delete(`${environment.apiUrl}/checkout/deleteOrder`, { body: { id: orderId } });
  }

  updateDeliveryStatus(orderId: string, status: string) {
    return this.http.put(`${environment.apiUrl}/checkout/updateDeliveryStatus`, {
      id: orderId,
      deliveryStatus: status
    });
  }

  updateOrderStatus(orderId: string, status: string) {
    return this.http.put(`${environment.apiUrl}/checkout/updateOrderStatus`, {
      id: orderId,
      orderStatus: status
    });
  }
}
