import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { Accounts } from '../accounts.model';
import { AccountsService } from '../accounts.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { mimeType } from '../../products/products-update/mime-type.validator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-accounts-discount',
  templateUrl: './accounts-discount.component.html',
  styleUrls: ['./accounts-discount.component.css', '../../admin-homepage.component.css'],
})
export class AccountsDiscountComponent implements OnInit, OnDestroy {
  accounts: Accounts;
  isLoading = false;
  private token: string;
  totalAccounts = 10;
  accountsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userId: string;
  userIsAuthenticated = false;
  private accountsSub: Subscription;
  private authStatusSub: Subscription;
  form: FormGroup;
  isMenuCollapsed = true; // Add this line

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
    private discountType: string;
    private image: any;
    private birthday: Date | string;

  constructor(
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private authService: AuthService,
    public accountsService: AccountsService
  ) {}


  //yung user id ng nakalogin yung nakukuha hindi yung sa pinindot na button

  ngOnInit() {
    this.isLoading = true;
    this.form = new FormGroup({
        // productType: new FormControl(null, {validators: [Validators.required]}),
        // productName: new FormControl(null, {validators: [Validators.required]}),
        // productDescription: new FormControl(null, {validators: [Validators.required]}),
        // image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
        // price: new FormControl(null, { validators: [Validators.required]}),
        // quantity: new FormControl(null, { validators: [Validators.required]}),
        discountType: new FormControl(null, { validators: [Validators.required]}),
        discountStatus: new FormControl(null, { validators: [Validators.required]}),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
        this.userId = paramMap.get('id');
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
        this.image = paramMap.get('imagePath');
        this.birthday = paramMap.get('birthday');
          this.isLoading = true;
          this.accountsService
            .getAccount(this.userId)
            .subscribe((accountData) => {
              this.isLoading = false;
              this.accounts = {
                id: accountData._id,
                password: accountData.password,
                email: accountData.email,
                firstname: accountData.firstname,
                lastname: accountData.lastname,
                contactnumber: accountData.contactnumber,
                city: accountData.city,
                province: accountData.province,
                bls: accountData.bls,
                subdivision: accountData.subdivision,
                postalcode: accountData.postalcode,
                role: accountData.role,
                imagePath: accountData.imagePath,
                birthday: accountData.birthday,
                discountType: accountData.discountType,
                discountStatus: accountData.discountStatus
              };
              this.form.setValue({
                discountType: this.accounts.discountType,
                discountStatus: this.accounts.discountStatus
              });
            });   
    if(!this.accounts){
        this.isLoading=false;
    }
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  });
}

toggleMenu() {
  this.isMenuCollapsed = !this.isMenuCollapsed;
}

onAccept() {
    this.form.get('discountStatus').setValue('Accepted');
    this.form.get('discountType').setValue(this.accounts.discountType);
}

onReject() {
    this.form.get('discountStatus').setValue('Rejected');
    this.form.get('discountType').setValue('N/A');
}

onUploadDiscount() {
    if (this.form.invalid) {
      return;
    }
      this.accountsService.updateDiscount(
        this.userId,
        this.form.value.discountType,
        this.form.value.discountStatus,
      );
    this.form.reset();
    this.isLoading = true;
    this.snackBar.open('Discount Updated!', 'Close', { duration: 3000 });
    console.log(this.form.value);
  }


  ngOnDestroy() {}

  onLogout() {
    this.authService.logout();
  }
}
