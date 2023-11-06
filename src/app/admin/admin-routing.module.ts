import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminHomepageComponent } from "./admin-homepage.component";
import { AccountsComponent } from "./accounts/accounts.component";
import { InventoryComponent } from "./inventory/inventory.component";
import { ProductsComponent } from "./products/products.component";
import { ReportsComponent } from "./reports/reports.component";
import { OrdersComponent } from "./orders/orders.component";
import { AdminGuard } from "./admin.guard";
import { InventoryUpdateComponent } from "./inventory/inventory-update/inventory-update.component";
import { AuthGuard } from "../auth/auth.guard";
import { ProductsUpdateComponent } from "./products/products-update/products-update.component";
import { AccountsDiscountComponent } from "./accounts/accounts-discount/accounts-discount.component";

const routes: Routes = [
    { path: 'dashboard', component: AdminHomepageComponent, canActivate:[AuthGuard] },
    { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard]},
    { path: 'accounts/:id', component: AccountsDiscountComponent, canActivate: [AuthGuard]},
    { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard] },
    { path: 'products', component: ProductsComponent, canActivate: [AuthGuard]},
    { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
    { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
    { path: 'inventory/create', component: InventoryUpdateComponent, canActivate: [AuthGuard] },
    { path: 'inventory/edit/:itemId', component: InventoryUpdateComponent, canActivate: [AuthGuard] }, 
    { path: 'products/create', component: ProductsUpdateComponent, canActivate: [AuthGuard] },
    { path: 'products/edit/:productId', component: ProductsUpdateComponent, canActivate: [AuthGuard] },    
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AdminRoutingModule{}

