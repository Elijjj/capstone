import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CheckoutService {
  constructor(private http: HttpClient) {}

  openPaymongoGateway(payload: any) {
    // TO DO: Move this to .env
    // Replace this with your secret key in paymongo account
    const paymongoSecretKey = 'sk_test_N5d44ZGz6gy6nGCcB6z3PrAF';

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization':  `Basic ${btoa(`${paymongoSecretKey}:`)}`,
        'X-Skip-Interceptor': 'true'
      }),
    };

    return this.http.post(
      'https://api.paymongo.com/v1/checkout_sessions',
      payload,
      httpOptions
    );
  }
}
