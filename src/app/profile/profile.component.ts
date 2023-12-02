import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { AuthService } from "../auth/auth.service";
import { AuthData } from "../auth/auth-data.model";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar, MatSnackBarHorizontalPosition } from "@angular/material/snack-bar";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Component({
    selector:'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit, OnDestroy{
    isLoading=false;
    authData: AuthData;
    userIsAuthenticated = false;
    userId: string;
    private authStatusSub: Subscription;
    isInputDisabled = true;
    form: FormGroup;
    imagePreview: string;
    horizontalPosition: MatSnackBarHorizontalPosition = "right";
    showConfirmButtons = false;

    constructor(public route: ActivatedRoute, private authService: AuthService, private snackBar: MatSnackBar) {}

    ngOnInit(){
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
    }

    toggleInputDisabled() {
        this.isInputDisabled = !this.isInputDisabled;
    }


    onUpdateAddressDetails() {
        this.userId = this.authService.getUserId();
        const updatedData: AuthData = {
            id: this.userId,
            email: this.authData.email,
            password: this.authData.password,
            firstname: this.authData.firstname,
            lastname: this.authData.lastname,
            contactnumber: this.authData.contactnumber,
            city: this.authData.city,
            province: this.authData.province,
            bls: this.authData.bls,
            subdivision: this.authData.subdivision,
            postalcode: this.authData.postalcode,
            role: this.authData.role,
            imagePath: this.authData.imagePath,
            // birthday: this.authData.birthday,
            discountType: this.authData.discountType,
            discountStatus: this.authData.discountStatus,
            verified: this.authData.verified,
        };
        this.authService.updateUserProfile(updatedData).subscribe(response => {
            console.log('User profile updated!', response);
            this.snackBar.open((response as any).message, 'Close', { duration: 3000, horizontalPosition: this.horizontalPosition});

        }, error => {
            console.error('Error updating profile:', error);
            this.snackBar.open((error as any).message, 'Close', { duration: 3000, panelClass: ['mat-toolbar', 'mat-warn'], horizontalPosition: this.horizontalPosition});
        });
    }

    showConfirmation() {
        this.showConfirmButtons = true;
    }

    hideConfirmation() {
        this.showConfirmButtons = false;
    }

    ngOnDestroy(){
        this.authStatusSub.unsubscribe();
    }
}