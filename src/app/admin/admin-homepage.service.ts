import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AdminHomepageService {
  constructor(private http: HttpClient) {}

  getOrdersCount$(): Observable<number> {
    return this.getOrders$().pipe(map((order: any[]) => order.length));
  }

  getDeliveryOrdersCount$(): Observable<number> {
    return this.getOrders$().pipe(
      map((orders) => {
        const deliveryOrders = orders.filter(
          (order) => order.orderType === 'Delivery'
        );
        console.log(deliveryOrders);
        return deliveryOrders.length;
      })
    );
  }

  getPickUpOrdersCount$(): Observable<number> {
    return this.getOrders$().pipe(
      map((orders) => {
        const pickUpOrders = orders.filter(
          (order) => order.orderType === 'Pick-Up'
        );
        console.log(pickUpOrders);
        return pickUpOrders.length;
      })
    );
  }

  getTotalSalesPerMonth$(): Observable<number> {
    return this.http
      .get(`${environment.apiUrl}/checkout/getTotalSalesPerMonth`)
      .pipe(
        map(
          (res: { message: string; order: any[] }) => res.order[0].totalAmount
        )
      );
  }

  getAdminAccountCount$(): Observable<number> {
    return this.http
      .get(`${environment.apiUrl}/user/getAdminAccounts`)
      .pipe(map((res: { message: string; users: any[] }) => res.users.length));
  }

  getAvailableProducts$(): Observable<number> {
    return this.http
      .get(`${environment.apiUrl}/products`)
      .pipe(
        map((res: { message: string; products: any[] }) => res.products.length)
      );
  }

  private getOrders$(): Observable<any[]> {
    return this.http
      .get(`${environment.apiUrl}/checkout`)
      .pipe(map((res: { message: string; order: any[] }) => res.order));
  }
}
