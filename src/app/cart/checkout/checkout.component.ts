import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subject,
  finalize,
  map,
  switchMap,
  takeUntil,
} from 'rxjs';
import { AuthData } from 'src/app/auth/auth-data.model';
import { AuthService } from '../../auth/auth.service';
import { Cart } from '../cart.model';
import { CartService } from '../cart.service';
import { Checkout } from './checkout.model';
import { CheckoutService } from './checkout.service';
import { MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [CheckoutService],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  isLoading = false;
  userId: string;
  discountType = '';
  discountStatus = '';
  bls = '';
  city = '';
  province = '';
  subdivision = '';
  postalcode = '';
  deliveryFee = 150; // Fixed delivery fee
  carts$!: Observable<Cart[]>; // Replace CartItem[] with your cart item model
  cartsSubject = new BehaviorSubject([]);
  authData: AuthData;
  timeOptions: string[] = [];

  showConfirmationDialog = false; // Flag for showing the confirmation dialog
  horizontalPosition: MatSnackBarHorizontalPosition = "right";
  today = new Date();

  private unsubscribe$ = new Subject();

  checkoutForm = new FormGroup({
    orderType: new FormControl('Pick-Up', Validators.required),
    claimDate: new FormControl(null, Validators.required),
    claimTime: new FormControl(null, Validators.required),
  });

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private selfService: CheckoutService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.isLoading = true;

    const userId = this.route.snapshot.params['userId'];

    this.authService
      .getUserProfileDiscount(userId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((userData: AuthData) => {
        this.authData = userData;
        this.discountType = userData.discountType;
        this.discountStatus = userData.discountStatus;
        this.bls = userData.bls;
        this.city = userData.city;
        this.province = userData.province;
        this.subdivision = userData.subdivision;
        this.postalcode = userData.postalcode;
      });

    this.carts$ = this.cartService.getCartsUpdateListener().pipe(
      map((carts) => {
        this.cartsSubject.next(carts);
        return carts;
      }),
      finalize(() => (this.isLoading = false))
    );

    this.cartService.getCarts$(this.authService.getUserId()).subscribe();

    this.onOrderTypeChange();
    this.checkoutForm.get('orderType').valueChanges.subscribe((value) => {
      this.onOrderTypeChange();
    });
  }

  isAddressComplete(): boolean {
    return this.bls !== '' && this.city !== '' && this.province !== '' && this.subdivision !== '' && this.postalcode !== '';
  }
  

  // onOrderTypeChange() {
  //   if (this.checkoutForm.get('orderType').value === 'Pick-Up') {
  //     this.timeOptions = ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];
  //   } else {
  //     this.timeOptions = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];
  //   }
  // }

  onOrderTypeChange() {
    const orderType = this.checkoutForm.get('orderType').value;
  
    if (orderType === 'Pick-Up') {
      this.timeOptions = ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];
    } else if (orderType === 'Delivery') {
      if (!this.isAddressComplete()) {
        // Show error and revert to Pick-Up if address is incomplete
        this.snackBar.open('Please complete address details in Profile Page to select Delivery', 'Close', { duration: 3000, horizontalPosition: this.horizontalPosition });
        this.checkoutForm.get('orderType').setValue('Pick-Up', { emitEvent: false });
        return;
      } else {
        this.timeOptions = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];
      }
    }
    
    // Reset claimTime to a placeholder value to ensure no automatic time selection
    this.checkoutForm.get('claimTime').setValue('');
    this.checkoutForm.get('orderType').valueChanges.subscribe((value) => {
      // Trigger any necessary updates that depend on the total price
    });
    this.updateClaimTimeOptions();
  }

  updateClaimTimeOptions() {
    const selectedDate = this.checkoutForm.value.claimDate;
    if (selectedDate && this.isToday(selectedDate)) {
      this.filterPastTimes();
    } else {
      this.resetTimeOptions();
    }
  
    // Check if the previously selected time is still valid for the new date
    const selectedTime = this.checkoutForm.get('claimTime').value;
    if (!this.timeOptions.includes(selectedTime)) {
      // Reset claimTime to the default placeholder value if the time is no longer valid
      this.checkoutForm.get('claimTime').setValue('');
    }
  }

  resetTimeOptions() {
    // Example default time options
    const orderType = this.checkoutForm.get('orderType').value;
    if(orderType === 'Pick-Up'){
      this.timeOptions = [
        '10:00 AM', '11:00 AM', '12:00 PM', 
        '1:00 PM', '2:00 PM', '3:00 PM', 
        '4:00 PM', '5:00 PM', '6:00 PM'
      ];
    }
    else{
      this.timeOptions = [
        '12:00 PM','1:00 PM', '2:00 PM', '3:00 PM', 
        '4:00 PM', '5:00 PM', '6:00 PM'
      ];
    }
  }
  

  filterPastTimes() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();

    this.timeOptions = this.timeOptions.filter(time => {
        const [hours, minutesPart] = time.split(':');
        let [minutes, period] = minutesPart.split(' ');
        let hour = parseInt(hours);

        hour = (period === 'PM' && hour !== 12) ? hour + 12 : hour;
        hour = (period === 'AM' && hour === 12) ? 0 : hour; // Convert 12 AM to 00 hours

        // Adjusting the condition to ensure the time is at least two hours ahead
        if (hour > currentHour + 1) {
            return true; // Time is more than two hours ahead
        } else if (hour === currentHour + 1 && currentMinutes === 0) {
            return parseInt(minutes) > 0; // For the next hour, allow only if minutes are not 00
        } else {
            return false; // Time is within one hour or past
        }
    });
}

  isToday(date: Date): boolean {
    // Check if the selected date is today
    return date.getDate() === this.today.getDate() &&
           date.getMonth() === this.today.getMonth() &&
           date.getFullYear() === this.today.getFullYear();
  }

  getMinClaimDate(): Date {
    const currentDate = new Date();
    let tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate());
    return tomorrow;
  }

  getMaxClaimDate(): Date {
    const currentDate = new Date();
    let tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 30);
    return tomorrow;
  }

  getTotalPrice(): number {
    let totalPrice = 0;
    for (const item of this.cartsSubject.value) {
      totalPrice += item.price;
    }
  
    // Add delivery fee for Delivery orders
    if (this.checkoutForm.get('orderType').value === 'Delivery') {
      totalPrice += this.deliveryFee;
    }
  
    return Math.round(totalPrice * 100) / 100; // Limit to 2 decimal places
  }

  getHighestPricedItem(): Cart {
    return this.cartsSubject.value.reduce((prev, current) => (prev.price > current.price) ? prev : current);
  } 
  
  getComputedDiscount(): number {
    if (this.discountStatus === 'Accepted' && 
        (this.discountType === 'Senior Citizen' || this.discountType === 'PWD')) {
      const highestPricedItem = this.getHighestPricedItem();
      let discountAmount = highestPricedItem.price / 1.12 * 0.2; // Assuming a 20% discount after removing VAT
      return Math.round(discountAmount * 100) / 100; // Limit to 2 decimal places
    } else {
      return 0; // No discount
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
    if (this.discountStatus === 'Pending') {
      // this.snackBar.open('Transaction cannot proceed when discount status is pending!', 'Close', { duration: 3000, panelClass: ['mat-toolbar', 'mat-warn'], horizontalPosition: this.horizontalPosition });
      this.showConfirmationDialog = true;
      return; // This stops the execution of the rest of the code in this function
    }
    else{
      this.processPayment();
    }
  }

  proceedWithPayment() {
    this.showConfirmationDialog = false; // Hide the dialog
    this.processPayment(); // Proceed with the payment process
  }

  cancelPayment() {
    this.showConfirmationDialog = false; // Hide the dialog
    // Optionally, implement any logic that should occur when payment is cancelled
  }

  private processPayment(){
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
                success_url: `http://fediciph-env-1.eba-niry4jf9.ap-southeast-2.elasticbeanstalk.com/payment-success/${orderId}`,
                // success_url: `http://localhost:4200/payment-success/${orderId}`,
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
      this.isLoading=false;
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
        name: `${resultString}, Discount - ${this.getComputedDiscount()}`,
        quantity: 1,
        amount: Math.round(this.getDiscounted() * 100 * 100) / 100, //Price is in cents
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
      discount: this.getComputedDiscount(),
      checkoutAmount: this.getDiscounted(),
      orderType: this.checkoutForm.value.orderType,
      claimDate: finalClaimDate,
      cartItems: this.mapOrderCartItems(),
      paymentStatus: 'UNPAID',
      orderStatus: 'FAILED',
      deliveryStatus: 'N/A',
    };
  }

  private mapOrderCartItems() {
    return this.cartsSubject.value.map((cart) => {
      let descriptionParts = [];
      if (cart.toppings) {
        descriptionParts.push(cart.toppings);
        descriptionParts.push(cart.crust);
      }
      if (cart.productType === 'Build-Your-Own' && cart.flowers) {
        descriptionParts.push(`Flowers: ${cart.flowers}`);
      } else if (cart.flowers) {
        descriptionParts.push(cart.flowers);
      }

      let description = descriptionParts.join(', ');
      if (description === '') {
        description = 'N/A';
      }

      return {
        productId: cart.productId,
        productType: cart.productType,
        quantity: cart.selectedQuantity,
        price: cart.price,
        name: cart.productName,
        size: cart.size,
        description: description,
      };
    });
}
}
