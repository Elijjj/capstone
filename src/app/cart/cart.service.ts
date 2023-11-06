import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environments';
import { Cart } from './cart.model';

const BACKEND_URL = environment.apiUrl + '/cart/';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // private cartItemsSubject = new BehaviorSubject<Cart[]>([]);
  private carts: Cart[] = [];
  productId: string;

  private cartItemsUpdated = new Subject<{
    carts: Cart[];
  }>();

  constructor(private http: HttpClient, private authService: AuthService) {
    // if (this.authService.getIsAuth()) {
    //   this.fetchCart();
    // }
  }

  fetchCart(id:string) {
    this.http
      .get<{ message: String; carts: any;}>(
        BACKEND_URL + id)
      .pipe(
        map((cartData) => {
          return {
            carts: cartData.carts.map((cart) => {
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
              flowers: cart.flowers
              };
            }),
          };
        })
      )
      .subscribe((transformedCartData) => {
        // console.log(transformedCartData);
        this.carts = transformedCartData.carts;
        this.cartItemsUpdated.next({
          carts: [...this.carts],
        });
      });
  }
  
  getCartsUpdateListener() {
    return this.cartItemsUpdated.asObservable();
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
  
  addToCart(userId: string, productId: string, selectedQuantity:number, quantity: number, originalPrice: number, price: number, imagePath: string, size: string, productDescription: string, productName: string, productType: string, toppings: string, crust: string, flowers: string) {
    // Check if the product with the given productId is already in the cart
    const existingCartItemIndex = this.carts.findIndex(item => item.productId === productId);
  
    if (existingCartItemIndex !== -1) {
      // If the product already exists in the cart, update its quantity
      this.carts[existingCartItemIndex].selectedQuantity =+ selectedQuantity;
      // Call the API to update the quantity on the server
      this.updateCartItem(userId, productId, this.carts[existingCartItemIndex].selectedQuantity, quantity, originalPrice, this.carts[existingCartItemIndex].selectedQuantity * originalPrice, imagePath, size, productDescription, productName, productType, toppings, crust, flowers);
    } else {
      // If the product is not in the cart, add it as a new item
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
        flowers: flowers
      };
      // Call the API to add the new item to the cart on the server
      this.http.post<{ message: string, cartItem: Cart }>(`${BACKEND_URL}${productId}`, cartItem)
        .subscribe((response) => {
          console.log('API Response:', response);
          this.carts.push(response.cartItem);
          this.cartItemsUpdated.next({carts: [...this.carts]});
        });
    }
  }
  
  removeFromCart(productId: string): Observable<void> {
    return this.http.delete<void>(`${BACKEND_URL}${productId}`)
      .pipe(
        catchError(error => {
          // Handle errors if needed
          return throwError(error);
        })
      );
  }
  
  // removeFromCart(productId: string) {
  //   return this.http.delete(BACKEND_URL + productId);
  // }

  updateCartItem(userId: string, productId: string, selectedQuantity:number, quantity: number, originalPrice:number, price: number, imagePath: string, size: string, productDescription: string, productName: string, productType: string,  toppings: string, crust: string, flowers: string) {
    // Call the API endpoint to update the item on the server
    let cartData: Cart;
    cartData = {userId: userId, productId: this.productId, selectedQuantity:selectedQuantity, quantity: quantity, originalPrice: originalPrice, price: price, imagePath: imagePath, size: size, productDescription: productDescription, productName:productName, productType: productType, toppings: toppings, crust: crust, flowers: flowers}
    this.http.put<{ message: string, cartItem: Cart[]}>(BACKEND_URL + productId, cartData)
        .subscribe(response => {
            this.carts = response.cartItem;
            this.cartItemsUpdated.next({carts: [...this.carts]});
        });
}

}


// getProduct(id: String) {
//   return this.http.get<{
//     productType: string,
//     productName: string,
//     _id: string,
//     productDescription: string,
//     imagePath: string,
//     price: number,
//     quantity: number,
//     size: string

//   }>(BACKEND_URL + id);
// }

// fetchCart(id: string) {
//   this.http.get<{ message: string, cartItems: any }>(`${BACKEND_URL}/${id}`)
//     .pipe(map(cartsData => {
//       return {
//         cart: cartsData.cartItems.map(carts => {
//           return {
//             userId: carts.userId,
//             productId: carts.productId,
//             productType: carts.productType,
//             productName: carts.productName,
//             productDescription: carts.productDescription,
//             imagePath: carts.imagePath,
//             price: carts.price,
//             quantity: carts.quantity,
//             size: carts.size 
//           };
//         })
//       };
//     }))
//     .subscribe(transformedCartData => {
//       console.log(transformedCartData);
//       this.carts = transformedCartData.cart;
//       this.cartItemsUpdated.next({ carts: [...this.carts] });
//     });
// }


// getProducts(productsPerPage: number, currentPage: number) {
//   const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;
//   this.httpClient.get<{message: String, products: any, maxProducts: number }>(BACKEND_URL + queryParams)
//   .pipe(map(productsData => {
//       return { products: productsData.products.map(products => {
//           return {
//               id: products._id,
//               productType: products.productType,
//               productName: products.productName,
//               productDescription: products.productDescription,
//               imagePath: products.imagePath,
//               price: products.price,
//               quantity: products.quantity,
//               size: products.size
              
//           };
//       }), maxProducts: productsData.maxProducts};
//   })).subscribe(transformedProductsData => {
//       console.log(transformedProductsData);
//       this.products = transformedProductsData.products;
//       this.productsUpdated.next({products: [...this.products], productsCount: transformedProductsData.maxProducts});
//   });
// }


// fetchCart(id: string, productId: string): Observable<Cart> {
//   this.productId = productId;
//   console.log(productId);
//   return this.http.get<{
//     userId: string,
//     productId: string,
//     productType: string,
//     productName: string,
//     productDescription: string,
//     imagePath: string,
//     price: number,
//     quantity: number,
//     size: string

//   }>(BACKEND_URL + id);
// }

// fetchCart(id: string) {
//   return this.http
//     .get<{ message: string; carts: any[] }>(BACKEND_URL+id)
//     .pipe(
//       map((cartData) => {
//         return {
//           products: cartData.carts.map((cart) => {
//             return {
//               userId: cart.userId,
//               productId: cart.productId,
//               productType: cart.productType,
//               productName: cart.productName,
//               productDescription: cart.productDescription,
//               imagePath: cart.imagePath,
//               price: cart.price,
//               quantity: cart.quantity,
//               size: cart.size,
//             };
//           }),
//         };
//       })
//     );
// }