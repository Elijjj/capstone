import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { ProductsService } from '../admin/products/products.service';
import { AuthService } from '../auth/auth.service';
import { Cart } from './cart.model';
import { CartService } from './cart.service';
import { Checkout } from './checkout/checkout.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  carts$!: Observable<Cart[]>;
  cartsSubject = new BehaviorSubject([]);
  checkout: Checkout;
  productId: string;
  isLoading = false;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;
  userId: string;
  mode = 'view';

  products = new BehaviorSubject(null);

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private productsService: ProductsService,
    private router: Router
  ) {}
  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();

    this.getCarts();

    this.authService.autoAuthUser();
  }

  removeFromCart(productId: string) {
    if (!productId) {
      console.error('Invalid productId:', productId);
      return;
    }

    this.isLoading = true;

    this.cartService.removeFromCart(productId).subscribe(
      (response) => {
        this.getCarts();
        this.snackBar.open((response as any).message, 'Close', {
          duration: 3000,
        });
      },
      (error) => {
        console.error('Error removing item from cart:', error);
        this.snackBar.open((error as any).message, 'Close', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-warn'],
        });
        this.isLoading = false; // Set isLoading to false in case of error
      }
    );
  }

  calculateItemPrice(item: any): number {
    return item.price;
  }

  getTotalPrice(): number {
    let totalPrice = 0;
    for (const item of this.cartsSubject.value) {
      totalPrice += item.price;
    }

    if (Number.isNaN(totalPrice)) {
      return 0;
    }
    return totalPrice;
  }

  updatePrice(item: Cart) {
    item.selectedQuantity = Math.max(1, Math.floor(item.selectedQuantity));
    if (item.selectedQuantity > item.quantity) {
      item.selectedQuantity = item.quantity;
      this.snackBar.open(
        'Selected quantity exceeds available quantity. Adjusted to maximum available.',
        'Close',
        { duration: 3000, panelClass: ['mat-toolbar', 'mat-warn'] }
      );

      return;
    }
    item.price = item.selectedQuantity * item.originalPrice;
    this.cartService
      .updateCartItem(
        item.userId,
        item.productId,
        item.selectedQuantity,
        item.quantity,
        item.originalPrice,
        item.price,
        item.imagePath,
        item.size,
        item.productDescription,
        item.productName,
        item.productType,
        item.toppings,
        item.crust,
        item.flowers
      )
      .subscribe();
  }

  showNoCartMsg(): boolean {
    return this.cartService.getCartsSnapshot()?.length <= 0 && !this.isLoading;
  }

  isCheckoutBtnDisabled() {
    return this.cartsSubject.value.some((x) => x.isOutOfStock);
  }

  onCheckout() {
    this.router.navigate(['/cart/checkout/', this.userId]);
  }

  private getCarts() {
    this.carts$ = this.productsService.getProductsForMenu().pipe(
      switchMap((resp) => {
        // this.products.next(resp.products);
        return this.cartService.getCarts$(this.authService.getUserId()).pipe(
          map((carts) => {
            return carts.map((cart) => {
              const product = resp.products.find(
                (p) => p.id === cart.productId
              );

              cart.isOutOfStock = product.quantity < cart.selectedQuantity;
              return cart;
            });
          }),
          tap((carts) => {
            this.cartsSubject.next(carts);
            this.isLoading = false;
          }),
          take(1)
        );
      })
    );
  }
}
