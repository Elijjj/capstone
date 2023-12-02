import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environments';
import { AuthService } from '../auth/auth.service';
import { Cart } from './cart.model';

const BACKEND_URL = environment.apiUrl + '/cart/';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private carts: Cart[] = [];
  productId: string;

  private cartItemsUpdated = new Subject<{
    carts: Cart[];
  }>();

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCarts$(id: string) {
    return this.http
      .get<{ message: String; carts: any }>(BACKEND_URL + id)
      .pipe(
        map((cartData) => {
          return cartData.carts.map((cart) => {
            return {
              userId: cart.userId,
              productId: cart.productId,
              productType: cart.productType,
              productName: cart.productName,
              productDescription: cart.productDescription,
              imagePath: cart.imagePath,
              price: cart.price,
              originalPrice: cart.originalPrice,
              selectedQuantity: cart.selectedQuantity,
              quantity: cart.quantity,
              size: cart.size,
              toppings: cart.toppings,
              crust: cart.crust,
              flowers: cart.flowers,
            };
          });
        }),
        tap((transformedCartData) => {
          this.carts = transformedCartData;
          this.cartItemsUpdated.next({
            carts: [...this.carts],
          });
        })
      );
  }

  getCartsUpdateListener(): Observable<Cart[]> {
    return this.cartItemsUpdated.asObservable().pipe(map((res) => res.carts));
  }

  getCartsSnapshot(): Cart[] {
    return this.carts;
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }

  addToCart(
    userId: string,
    productId: string,
    selectedQuantity: number,
    quantity: number,
    originalPrice: number,
    price: number,
    imagePath: string,
    size: string,
    productDescription: string,
    productName: string,
    productType: string,
    toppings: string,
    crust: string,
    flowers: string
  ) {
    // If the product is not in the cart, add it as a new item
    if (productType === 'Build-Your-Own') {
      selectedQuantity = 1;
    }

    const cartItem: Cart = {
      userId: userId,
      productId: productId,
      productType: productType,
      selectedQuantity: selectedQuantity,
      quantity: quantity,
      price: price,
      originalPrice: originalPrice,
      imagePath: imagePath,
      size: size,
      productDescription: productDescription,
      productName: productName,
      toppings: toppings,
      crust: crust,
      flowers: flowers,
    };
    // Call the API to add the new item to the cart on the server
    return this.http
      .post<{ message: string; cartItem: Cart }>(
        `${BACKEND_URL}${productId}`,
        cartItem
      )
      .pipe(
        map((response) => {
          console.log('API Response:', response);
          this.carts.push(response.cartItem);
          this.cartItemsUpdated.next({ carts: [...this.carts] });

          return response;
        })
      );
  }

  removeFromCart(cartItemId: string): Observable<void> {
  return this.http.delete<void>(`${BACKEND_URL}${cartItemId}`).pipe(
    catchError((error) => {
      // Handle errors if needed
      return throwError(error);
    }),
    tap(() => {
      // Update the local carts array to remove the item
      this.carts = this.carts.filter(cartItem => cartItem._id !== cartItemId);
      this.cartItemsUpdated.next({ carts: [...this.carts] });
    })
  );
}

  updateCartItem(
    userId: string,
    productId: string,
    selectedQuantity: number,
    quantity: number,
    originalPrice: number,
    price: number,
    imagePath: string,
    size: string,
    productDescription: string,
    productName: string,
    productType: string,
    toppings: string,
    crust: string,
    flowers: string
  ): Observable<{ message: string; cartItem: Cart }> {

    if (productType === 'Build-Your-Own') {
      // Call addToCart instead of updating
      return this.addToCart(
        userId,
        productId,
        selectedQuantity,
        quantity,
        originalPrice,
        price,
        imagePath,
        size,
        productDescription,
        productName,
        productType,
        toppings,
        crust,
        flowers
      );
    }
    // Call the API endpoint to update the item on the server
    let cartData: Cart;
    cartData = {
      userId: userId,
      productId: this.productId,
      selectedQuantity: selectedQuantity,
      quantity: quantity,
      originalPrice: originalPrice,
      price: selectedQuantity * originalPrice,
      imagePath: imagePath,
      size: size,
      productDescription: productDescription,
      productName: productName,
      productType: productType,
      toppings: toppings,
      crust: crust,
      flowers: flowers,
    };

    return this.http.put<{ message: string; cartItem: Cart }>(
      BACKEND_URL + productId,
      cartData
    ).pipe(
      tap(response => {
        // Handle successful response
      }),
      catchError(error => {
        // Handle error
        return throwError(error);
      })
    );
  }

  createCheckout(checkoutData: {
    cartItems: string[];
    userId: string;
    paymentMethod: string;
    shippingAddress: string;
    billingAddress: string;
    totalAmount: number;
  }): Observable<any> {
    return this.http.post(`${BACKEND_URL}/checkout`, checkoutData);
  }
}
