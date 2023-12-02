import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';


@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  private userId: string;
  private imagePath: string;
  // private birthday: Date;
  private discountType: string;
  private discountStatus: string;
  private verified: boolean;
  firstName: string = '';
  lastName: string = '';
  cityName: string = '';
  provinceName: string = '';
  blsName: string = '';
  subdivisionName: string = '';
  showPassword = false;
  horizontalPosition: MatSnackBarHorizontalPosition = "right";
  constructor(public authService: AuthService,
    private snackBar: MatSnackBar,) {
    }

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  capitalizeFirstLetter() {
    if (this.firstName.length > 0) {
      this.firstName = this.firstName[0].toUpperCase() + this.firstName.slice(1);
    }

    if (this.lastName.length > 0) {
      this.lastName = this.lastName[0].toUpperCase() + this.lastName.slice(1);
    }

    if (this.cityName.length > 0) {
      this.cityName = this.cityName[0].toUpperCase() + this.cityName.slice(1);
    }

    if (this.provinceName.length > 0) {
      this.provinceName = this.provinceName[0].toUpperCase() + this.provinceName.slice(1);
    }

    if (this.blsName.length > 0) {
      this.blsName = this.blsName[0].toUpperCase() + this.blsName.slice(1);
    }

    if (this.subdivisionName.length > 0) {
      this.subdivisionName = this.subdivisionName[0].toUpperCase() + this.subdivisionName.slice(1);
    }
  }

  onSignup(form: NgForm) {
    if (form.value.password !== form.value.confirmpassword) {
      this.snackBar.open('Passwords do not match!', 'Close', { duration: 3000, panelClass: ['mat-toolbar', 'mat-warn'], horizontalPosition: this.horizontalPosition });
      return;
  }
    if (form.invalid) {
    if(form.controls.contactnumber?.errors?.pattern){
      this.snackBar.open('Enter an 11 digit phone number only!', 'Close', { duration: 3000, panelClass: ['mat-toolbar', 'mat-warn'],
      horizontalPosition: this.horizontalPosition });
    }
    else if(form.controls.password?.errors?.pattern){
      this.snackBar.open('Password should be more than 8 characters and contain a capital letter!', 'Close', { duration: 3000, panelClass: ['mat-toolbar', 'mat-warn'],
      horizontalPosition: this.horizontalPosition });
    }
    else{
      this.snackBar.open('Sign Up Unsuccessful! Please double-check your details!', 'Close', { duration: 3000, panelClass: ['mat-toolbar', 'mat-warn'],
      horizontalPosition: this.horizontalPosition });
    }
      return;
    }
    this.isLoading = true;
    this.authService.createUser(
      form.value.email,
      form.value.password,
      form.value.firstname,
      form.value.lastname,
      form.value.contactnumber,
      form.value.city,
      form.value.province,
      form.value.bls,
      form.value.subdivision,
      form.value.postalcode,
      'Customer',
      this.imagePath,
      // this.birthday,
      this.discountType,
      this.discountStatus,
      this.verified,
    );
    this.snackBar.open('Sign Up Successful! Check your email for verification!', 'Close', { duration: 3000, horizontalPosition: this.horizontalPosition} );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
