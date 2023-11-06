import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CartService } from "./cart.service";
import { Observable, Subscription } from 'rxjs';
import { Cart } from "./cart.model";
import { AuthService } from "../auth/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
    carts: Cart[] = [];
    private cartSubscription: Subscription;
    productId: string;
    isLoading = false;
    private authStatusSub: Subscription;
    userIsAuthenticated = false;
    userId: string;
    mode = 'view';

    constructor(private cdr: ChangeDetectorRef, private cartService: CartService, private route: ActivatedRoute, private authService: AuthService, private snackBar: MatSnackBar) {}


    // ngOnInit() {
    //   this.isLoading = true;
    //   this.userId = this.authService.getUserId();
    //   this.route.paramMap.subscribe((paramMap: ParamMap) => {
    //     this.userId = paramMap.get('userId');
    //     this.productId = paramMap.get('productId');
    //     this.isLoading = true;
    //     this.cartService.fetchCart(this.userId).subscribe(
    //         (cartData: any) => {
    //             this.isLoading = false;
    //             this.carts = cartData.cart;
    //             console.log("Titeh" + this.carts);
    //             console.log(cartData);
    //         },
    //         (error) => {
    //             console.error("Error fetching cart data: ", error);
    //             this.isLoading = false;
    //         }
    //     );
    // });
    //   this.authService.autoAuthUser();
    // }

    ngOnInit() {
      this.isLoading = true;
      this.userId = this.authService.getUserId();
      this.cartSubscription = this.cartService
        .getCartsUpdateListener()
        .subscribe(
          (cartData: { carts: Cart[] }) => {
            this.isLoading = false;
            this.carts = cartData.carts;
            // console.log('Received cart data:', cartData);
          }
        );
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe((isAuthenticated) => {
          this.userIsAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();
        });
      this.cartService.fetchCart(this.userId); // Fetch initial cart data
      this.authService.autoAuthUser();
    }
    
    // ngOnInit() {
    //   this.isLoading = true;
    //   // Fetch product data from the service
    //   this.cartService.fetchCart(this.userId).subscribe(
    //     (transformedCartData) => {
    //       console.log(transformedCartData);
    //       this.cartProducts = this.categorizeProducts(transformedCartData.products);
    //       this.isLoading = false;
    //     },
    //     (error) => {
    //       console.error("Error fetching products: ", error);
    //       this.isLoading = false;
    //     }
    //   );
    // }
    
  //   ngOnInit(){
  //     this.isLoading=true;
  //     this.cartService.fetchCart(this.userId);
  //     this.cartSubscription = this.cartService.getCartsUpdateListener()
  //     .subscribe((cartData: {carts: Cart[]}) => {
  //         this.isLoading=false;
  //         this.carts = cartData.carts;
  //     });
  //     this.userIsAuthenticated = this.authService.getIsAuth();
  //     this.authStatusSub = this.authService.getAuthStatusListener()
  //     .subscribe(isAuthenticated => {
  //         this.userIsAuthenticated = isAuthenticated;
  //     });
  // }
    // removeFromCart(item: Cart) {
    //   if (item && item.productId) {
    //     this.cartService.removeFromCart(item.productId);
    //   } else {
    //     console.error('Invalid productId:', item.productId);
    //     // Handle the error or display a message to the user
    //   }
    // }

    removeFromCart(productId: string) {
      if (!productId) {
        console.error('Invalid productId:', productId);
        return; // Do not proceed if productId is invalid
      }
    
      this.isLoading = true;
    
      this.cartService.removeFromCart(productId).subscribe(response => {
          // Cart item removed successfully, fetch updated cart data
          this.cartService.fetchCart(this.userId);
          this.snackBar.open((response as any).message, 'Close', { duration: 3000 });
        },
        (error) => {
          // Handle error here, you can log the error message
          console.error('Error removing item from cart:', error);
          this.snackBar.open((error as any).message, 'Close', { duration: 3000, panelClass: ['mat-toolbar', 'mat-warn'] });
          this.isLoading = false; // Set isLoading to false in case of error
        }
      );
    }
    
    updateQuantity(item: Cart, newQuantity: number) {
      if (newQuantity > item.quantity) {
          // Display a warning message to the user using MatSnackBar
          this.snackBar.open('Selected quantity exceeds available quantity', 'Close', { duration: 3000, panelClass: ['mat-toolbar', 'mat-warn'] });
          return;
      }
      item.selectedQuantity = newQuantity;
      this.cartService.updateCartItem(item.userId, item.productId, item.selectedQuantity, item.quantity, item.originalPrice, item.price, item.imagePath, item.size, item.productDescription, item.productName, item.productType, item.toppings, item.crust, item.flowers);
  } 

    calculateItemPrice(item: any): number {
        return item.price;
    }

    getTotalPrice(): number {
      let totalPrice = 0;
      for (const item of this.carts) {
          totalPrice += item.price;
      }
      return totalPrice;
  }

  updatePrice(item: Cart) {
    // Ensure the quantity is a positive integer
    item.selectedQuantity = Math.max(1, Math.floor(item.selectedQuantity));

    // Check if selectedQuantity exceeds item's quantity
    if (item.selectedQuantity > item.quantity) {
        // Reset the selectedQuantity to available quantity
        item.selectedQuantity = item.quantity;
        // Display a warning message to the user using MatSnackBar
        this.snackBar.open('Selected quantity exceeds available quantity. Adjusted to maximum available.', 'Close', { duration: 3000, panelClass: ['mat-toolbar', 'mat-warn'] });
    }

    // Calculate the total price based on the original price and updated quantity
    item.price = item.selectedQuantity * item.originalPrice;

    // Call the service to update the cart item on the server
    this.cartService.updateCartItem(item.userId, item.productId, item.selectedQuantity, item.quantity, item.originalPrice, item.price, item.imagePath, item.size, item.productDescription, item.productName, item.productType, item.toppings, item.crust, item.flowers);
    this.cdr.detectChanges();
}
    

    ngOnDestroy() {
      if (this.cartSubscription) {
        this.cartSubscription.unsubscribe();
      }
    }
}
