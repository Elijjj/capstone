import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
    isLoading = false;
    private authStatusSub: Subscription;
    private userId: string;
    showPassword = false;
    constructor(public authService: AuthService,
        private snackBar: MatSnackBar) {}

    ngOnInit() {
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
            authStatus => {
                this.isLoading = false;
            });
    }

    onLogin(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.isLoading = true;

        this.authService.login(
            this.userId,
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
            form.value.imagePath,
            // form.value.birthday,
            form.value.discountType,
            form.value.discountStatus,
            false
        );
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
      }

    ngOnDestroy() {
        this.authStatusSub.unsubscribe();
    }
}