import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from "../../auth/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CartService } from "../cart.service";
import { Checkout } from "./checkout.model";
import { Cart } from "../cart.model";
import { AuthData } from "src/app/auth/auth-data.model";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  private checkoutStatusSub: Subscription;
  private cartId: string;
  userId: string;
  discountType: string;
  carts: Cart[]; // Replace CartItem[] with your cart item model
  authData: AuthData;
  checkout: Checkout;
  userIsAuthenticated = false;
  private cartSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.isLoading=true;
    this.authService.getUserProfile().subscribe(
        (data: any) => {
            this.authData = data;
            this.isLoading=false;
        },
        error => {
            console.error("Error fetching user profile: ", error);
        }
    );
        if(!this.authData){
            this.isLoading=false;
        }

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
        authStatus => {
            this.isLoading=false;
            this.userIsAuthenticated = authStatus;
        });

        this.cartSubscription = this.cartService
        .getCartsUpdateListener()
        .subscribe(
          (cartData: { carts: Cart[] }) => {
            this.isLoading = false;
            this.carts = cartData.carts;
          }
        );

        this.cartService.fetchCart(this.userId);
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
                discountStatus: userData.discountStatus
              };
            });
      });
      console.log(this.discountType);
  }

  getTotalPrice(): number {
    let totalPrice = 0;
    for (const item of this.carts) {
        totalPrice += item.price;
    }
    return Math.round(totalPrice * 100) / 100; // Limit to 2 decimal places
}

getComputedDiscount(): number {
    if (this.discountType !== 'Senior Citizen' || 'PWD') {
        let discountVat = this.getTotalPrice() / 1.12;
        let discountVatComputed = discountVat * 0.20;  
        let computedDiscount = discountVat - discountVatComputed;
        return Math.round(computedDiscount * 100) / 100; // Limit to 2 decimal places
    }
    else {
        return this.getTotalPrice();
    }
}

getDiscounted(): number {
    const computedPrice = this.getTotalPrice() - this.getComputedDiscount();
    return Math.round(computedPrice * 100) / 100; // Limit to 2 decimal places
}

  ngOnDestroy() {
    if(this.checkoutStatusSub){
      this.checkoutStatusSub.unsubscribe();
    }
    this.authStatusSub.unsubscribe();
  }
}
