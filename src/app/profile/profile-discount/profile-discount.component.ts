import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { ProductsService } from "src/app/admin/products/products.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { CartService } from "src/app/cart/cart.service";
import { mimeType } from "src/app/admin/products/products-update/mime-type.validator";
import { AuthService } from "src/app/auth/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthData } from "src/app/auth/auth-data.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
    selector:'app-profile-discount',
    templateUrl: './profile-discount.component.html',
    styleUrls: ['./profile-discount.component.css']
})

export class ProfileDiscountComponent implements OnInit, OnDestroy {
    authData: AuthData;
    userIsAuthenticated = false;
    userId: string;
    isLoading = false;
    form: FormGroup;
    private authStatusSub: Subscription;
    imagePreview: string;

    private email: string;
    private password: string;
    private firstname: string;
    private lastname: string;
    private contactnumber: string;
    private city: string;
    private province: string;
    private bls: string;
    private subdivision: string;
    private postalcode: string;
    private role: string;
    private discountStatus: string;

    startDate = new Date(2000, 0, 1);

    constructor(public route: ActivatedRoute, private authService: AuthService, private snackBar: MatSnackBar) {}

    ngOnInit() {
        this.isLoading=true;
        this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe((authStatus) => {
          this.isLoading = false;
        });
    this.form = new FormGroup({
        image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
        birthday: new FormControl(null, {validators: [Validators.required]}),
        discountType: new FormControl(null, {validators: [Validators.required]}),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
        this.userId = paramMap.get('userId');
        this.email = paramMap.get('email');
        this.password = paramMap.get('password');
        this.firstname = paramMap.get('firstname');
        this.lastname = paramMap.get('lastname');
        this.contactnumber = paramMap.get('contactnumber');
        this.city = paramMap.get('city');
        this.province = paramMap.get('province');
        this.bls = paramMap.get('bls');
        this.subdivision = paramMap.get('subdivision');
        this.postalcode = paramMap.get('postalcode');
        this.role = paramMap.get('role');
        this.discountStatus = paramMap.get('discountStatus');
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
            this.form.setValue({
                image: this.authData.imagePath,
                birthday: this.authData.birthday,
                discountType: this.authData.discountType,
              });
          });
    });
    }

    onUploadDiscount() {
        if (this.form.invalid) {
          return;
        }
          this.authService.updateDiscount(
            this.userId,
            this.email,
            this.password,
            this.firstname,
            this.lastname,
            this.contactnumber,
            this.city,
            this.province,
            this.bls,
            this.subdivision,
            this.postalcode,
            this.role,
            this.form.value.image,
            this.form.value.birthday,
            this.form.value.discountType,
            this.discountStatus,
          );
        this.form.reset();
        this.isLoading = true;
      }

    onImagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({ image: file });
        this.form.get('image').updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
        console.log(file);
      }
      
    ngOnDestroy() {
            this.authStatusSub.unsubscribe();
    }
}
