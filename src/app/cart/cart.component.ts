import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CartService } from "./cart.service";
import { Observable, Subscription } from 'rxjs';
import { Cart } from "./cart.model";
import { AuthService } from "../auth/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ChangeDetectorRef } from '@angular/core';
import { Checkout } from "./checkout/checkout.model";

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
    carts: Cart[] = [];
    checkout: Checkout;
    private cartSubscription: Subscription;
    productId: string;
    isLoading = false;
    private authStatusSub: Subscription;
    userIsAuthenticated = false;
    userId: string;
    mode = 'view';

    constructor(private cdr: ChangeDetectorRef, private cartService: CartService, private route: ActivatedRoute, private authService: AuthService, private snackBar: MatSnackBar) {}
    ngOnInit() {
      this.isLoading = true;
      this.userId = this.authService.getUserId();
      this.cartSubscription = this.cartService
        .getCartsUpdateListener()
        .subscribe(
          (cartData: { carts: Cart[] }) => {
            this.isLoading = false;
            this.carts = cartData.carts;
          }
        );
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe((isAuthenticated) => {
          this.userIsAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();
        });
      this.cartService.fetchCart(this.userId);
      this.authService.autoAuthUser();
    }
    
    removeFromCart(productId: string) {
      if (!productId) {
        console.error('Invalid productId:', productId);
        return;
      }
    
      this.isLoading = true;
    
      this.cartService.removeFromCart(productId).subscribe(response => {
          this.cartService.fetchCart(this.userId);
          this.snackBar.open((response as any).message, 'Close', { duration: 3000 });
        },
        (error) => {
          console.error('Error removing item from cart:', error);
          this.snackBar.open((error as any).message, 'Close', { duration: 3000, panelClass: ['mat-toolbar', 'mat-warn'] });
          this.isLoading = false; // Set isLoading to false in case of error
        }
      );
    }
    
    updateQuantity(item: Cart, newQuantity: number) {
      if (newQuantity > item.quantity) {
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
    item.selectedQuantity = Math.max(1, Math.floor(item.selectedQuantity));
    if (item.selectedQuantity > item.quantity) {
        item.selectedQuantity = item.quantity;
        this.snackBar.open('Selected quantity exceeds available quantity. Adjusted to maximum available.', 'Close', { duration: 3000, panelClass: ['mat-toolbar', 'mat-warn'] });
    }
    item.price = item.selectedQuantity * item.originalPrice;
    this.cartService.updateCartItem(item.userId, item.productId, item.selectedQuantity, item.quantity, item.originalPrice, item.price, item.imagePath, item.size, item.productDescription, item.productName, item.productType, item.toppings, item.crust, item.flowers);
    this.cdr.detectChanges();
}
onCheckout(){
  
}

    ngOnDestroy() {
      if (this.cartSubscription) {
        this.cartSubscription.unsubscribe();
      }
    }
}
