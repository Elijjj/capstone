import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(private http: HttpClient) {}

  getMonthlyCustomers$(monthDate: string): Observable<number> {
    return this.getReportsPerMonth$(monthDate).pipe(map((x) => x.length));
  }

  getMostFrequentCustomer$(monthDate: string): Observable<string> {
    return this.getReportsPerMonth$(monthDate).pipe(
      map((orders) => {
        if (orders.length === 0) {
          return `<span class="text-danger">No sales this month<span>`;
        }
        // Find the item with the highest orderCount
        const maxOrderItem = orders.reduce((prev, current) =>
          prev.orderCount > current.orderCount ? prev : current
        );

        // Get the firstname and lastname of the most ordered item
        const mostOrderedFirstname = maxOrderItem.firstname;
        const mostOrderedLastname = maxOrderItem.lastname;

        return `${mostOrderedFirstname} ${mostOrderedLastname}`;
      })
    );
  }

  getMostBoughtProduct$(monthDate: string): Observable<string> {
    return this.getReportsPerMonth$(monthDate).pipe(
      map((orders) => {
        if (orders.length === 0) {
          return `<span class="text-danger">No sales this month<span>`;
        }
        // Find the item with the highest quantity in mostOrderedItem
        const maxQuantityItem = orders.reduce((prev, current) =>
          prev.mostOrderedItem.quantity > current.mostOrderedItem.quantity
            ? prev
            : current
        );

        // Get the product name of the most ordered item
        const mostOrderedProductName = maxQuantityItem.mostOrderedItem.name;

        return mostOrderedProductName;
      })
    );
  }

  getReportsPerMonth$(monthDate: string) {
    return this.http
      .get(
        `${environment.apiUrl}/checkout/getReportsPerMonth?startOfMonth=${monthDate}`
      )
      .pipe(map((res: { message: string; order: any[] }) => res.order));
  }
}
