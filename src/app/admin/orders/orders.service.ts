import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(private http: HttpClient) {}

  getAllOrders$(monthDate: string): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/checkout/getAll?startOfMonth=${monthDate}`)
      .pipe(map((res: { message: string; order: any }) => res.order as any[]));
  }
}
