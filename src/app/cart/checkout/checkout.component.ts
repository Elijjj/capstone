import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  finalize,
  map,
  switchMap,
} from 'rxjs';
import { AuthData } from 'src/app/auth/auth-data.model';
import { AuthService } from '../../auth/auth.service';
import { Cart } from '../cart.model';
import { CartService } from '../cart.service';
import { Checkout } from './checkout.model';
import { CheckoutService } from './checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [CheckoutService],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  private cartId: string;
  userId: string;
  discountType: string;
  carts$!: Observable<Cart[]>; // Replace CartItem[] with your cart item model
  cartsSubject = new BehaviorSubject([]);
  authData: AuthData;
  checkout: Checkout;
  userIsAuthenticated = false;
  private cartSubscription: Subscription;

  private unsubscribe$ = new Subject();

  checkoutForm = new FormGroup({
    orderType: new FormControl('Pick-Up', Validators.required),
    claimDate: new FormControl(null, Validators.required),
    claimTime: new FormControl('10:00 AM', Validators.required),
  });

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private selfService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.isLoading = true;
    this.authService.getUserProfile().subscribe(
      (data: any) => {
        this.authData = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching user profile: ', error);
      }
    );
    if (!this.authData) {
      this.isLoading = false;
    }

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
        this.userIsAuthenticated = authStatus;
      });

    this.carts$ = this.cartService.getCartsUpdateListener().pipe(
      map((carts) => {
        this.cartsSubject.next(carts);
        return carts;
      }),
      finalize(() => (this.isLoading = false))
    );

    this.cartService.getCarts$(this.authService.getUserId()).subscribe();

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.userId = paramMap.get('userId');
      this.discountType = paramMap.get('discountType');
      this.authService
        .getUserProfileDiscount(this.userId)
        .subscribe((userData) => {
          this.isLoading = false;
          this.authData = {
            id: userData.id,
            email: userData.email,
            password: userData.password,
            firstname: userData.firstname,
            lastname: userData.lastname,
            contactnumber: userData.contactnumber,
            city: userData.city,
            province: userData.province,
            bls: userData.bls,
            subdivision: userData.subdivision,
            postalcode: userData.postalcode,
            role: userData.role,
            imagePath: userData.imagePath,
            birthday: userData.birthday,
            discountType: userData.discountType,
            discountStatus: userData.discountStatus,
          };
        });
    });
    console.log(this.discountType);
  }

  getMinClaimDate(): Date {
    const currentDate = new Date();
    let tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);
    return tomorrow;
  }

  getTotalPrice(): number {
    let totalPrice = 0;
    for (const item of this.cartsSubject.value) {
      totalPrice += item.price;
    }
    return Math.round(totalPrice * 100) / 100; // Limit to 2 decimal places
  }

  getComputedDiscount(): number {
    if (this.discountType !== 'Senior Citizen' || 'PWD') {
      let discountVat = this.getTotalPrice() / 1.12;
      let discountVatComputed = discountVat * 0.2;
      let computedDiscount = discountVat - discountVatComputed;
      return Math.round(computedDiscount * 100) / 100; // Limit to 2 decimal places
    } else {
      return this.getTotalPrice();
    }
  }

  getDiscounted(): number {
    const computedPrice = this.getTotalPrice() - this.getComputedDiscount();
    return Math.round(computedPrice * 100) / 100; // Limit to 2 decimal places
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  onProceedToPaymentClick() {
    this.selfService
      .saveOrderDetails(this.getSaveOrderDetailsPayload())
      .pipe(
        switchMap((orderId: string) => {
          const payload = {
            data: {
              attributes: {
                send_email_receipt: false,
                show_description: false,
                show_line_items: true,
                payment_method_types: ['card', 'paymaya', 'gcash', 'grab_pay'],
                line_items: this.mapPaymentItems(),
                success_url: `http:localhost:4200/payment-success/${orderId}`,
              },
            },
          };
          return this.selfService.openPaymongoGateway(payload);
        }),
        map((gatewayResponse: any) => {
          return gatewayResponse.data.attributes.checkout_url;
        })
      )
      .subscribe((checkOutUrl: string) => {
        window.location.replace(checkOutUrl);
        // window.open(checkOutUrl, "_blank");
      });
  }

  private mapPaymentItems() {
    const names = this.cartsSubject.value.map((cart) => cart.productName);
    const quantities = this.cartsSubject.value.map(
      (cart) => cart.selectedQuantity
    );
    const prices = this.cartsSubject.value.map((cart) => cart.price);

    const resultArray = names.map(
      (name, index) => `${name} - ${quantities[index]} - ${prices[index]}`
    );
    const resultString = resultArray.join(' | ');

    return [
      {
        name: `${resultString}, Discount - ${this.getDiscounted()}`,
        quantity: 1,
        amount: Math.round(this.getComputedDiscount() * 100 * 100) / 100, //Price is in cents
        currency: 'PHP',
      },
    ];
  }

  private getSaveOrderDetailsPayload() {
    const claimDate = this.checkoutForm.value.claimDate.toLocaleDateString();
    const claimTime = this.checkoutForm.value.claimTime;
    const finalClaimDate = new Date(`${claimDate} ${claimTime}`).toISOString();

    return {
      userId: this.authService.getUserId(),
      totalPrice: this.getTotalPrice(),
      discount: this.getDiscounted(),
      checkoutAmount: this.getComputedDiscount(),
      orderType: this.checkoutForm.value.orderType,
      claimDate: finalClaimDate,
      cartItems: this.mapOrderCartItems(),
      paymentStatus: 'UNPAID',
      orderStatus: 'PROCESSING',
    };
  }

  private mapOrderCartItems() {
    return this.cartsSubject.value.map((cart) => {
      return {
        productId: cart.productId,
        quantity: cart.selectedQuantity,
        price: cart.price,
        name: cart.productName,
        size: cart.size,
        description: cart.toppings
          ? `${cart.toppings}, ${cart.crust}, Flowers: ${cart.flowers}`
          : 'N/A',
      };
    });
  }
}
