import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  private userId: string;
  private imagePath: string;
  private birthday: Date;
  private discountType: string;
  private discountStatus: string;

  constructor(public authService: AuthService,
    private snackBar: MatSnackBar,) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  onSignup(form: NgForm) {
    if (form.value.password !== form.value.confirmpassword) {
      this.snackBar.open('Passwords do not match!', 'Close', { duration: 3000, panelClass: ['mat-toolbar', 'mat-warn'] });
      return;
  }
    if (form.invalid) {
      this.snackBar.open('Sign Up Unsuccessful!', 'Close', { duration: 3000, panelClass: ['mat-toolbar', 'mat-warn'] });
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
      this.birthday,
      this.discountType,
      this.discountStatus
    );
    this.snackBar.open('Sign Up Successful!', 'Close', { duration: 3000 });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
