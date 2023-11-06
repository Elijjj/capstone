import { NgModule } from "@angular/core";
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from "./auth-routing.module";
import { AngularMaterialModule } from "../angular-material.model";

@NgModule({
    declarations:[
        LoginComponent,
        SignupComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        AngularMaterialModule,
        AuthRoutingModule
    ]
})
export class AuthModule {}