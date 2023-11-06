import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from "../angular-material.model";
import { AccountsComponent } from "./accounts/accounts.component";
import { ProductsComponent } from "./products/products.component";
import { OrdersComponent } from "./orders/orders.component";
import { ReportsComponent } from "./reports/reports.component";
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminHomepageComponent } from "./admin-homepage.component";
import { AccountsDiscountComponent } from "./accounts/accounts-discount/accounts-discount.component";

@NgModule({
    declarations:[
        AdminHomepageComponent,
        AccountsComponent,
        AccountsDiscountComponent,
        OrdersComponent,
        ReportsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        AdminRoutingModule
    ]
})
export class AdminModule {}