import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable()
export class ClientOrdersService {
  constructor(private http: HttpClient) {}

  getClientOrders$(userId: string): Observable<any[]> {
    return this.http
      .get(`${environment.apiUrl}/checkout?userId=${userId}`)
      .pipe(
        map(
          (res: { message: string; order: any }) => res.order as any[]
        )
      );
  }
}
