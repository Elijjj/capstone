import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(private http: HttpClient) {}

  getAllOrders$(): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/checkout/getAll`)
      .pipe(map((res: { message: string; order: any }) => res.order as any[]));
  }
}
