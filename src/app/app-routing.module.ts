import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AboutUsComponent } from "./aboutus/aboutus.component";
import { AdminGuard } from "./admin/admin.guard";
import { AuthGuard } from "./auth/auth.guard";
import { ByocProductComponent } from "./byoc/byoc-product/byoc-product.component";
import { ByocComponent } from "./byoc/byoc.component";
import { CartComponent } from "./cart/cart.component";
import { CheckoutComponent } from "./cart/checkout/checkout.component";
import { PaymentSuccessComponent } from "./cart/payment-success/payment-success.component";
import { ClientOrdersComponent } from "./client-orders/client-orders.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { MenuProductComponent } from "./menu/menu-product/menu-product.component";
import { MenuComponent } from "./menu/menu.component";
import { ProfileDiscountComponent } from "./profile/profile-discount/profile-discount.component";
import { ProfileComponent } from "./profile/profile.component";
import { VerifyComponent } from "./verify/verify.component";
// import { AdminGuard } from "./admin/admin.guard";

const routes: Routes = [
    { path: "", component: HomepageComponent },
    { path: "menu", component: MenuComponent },
    { path: "menu/view/:productId", component: MenuProductComponent, canActivate: [AuthGuard] },
    { path: "byoc", component: ByocComponent },
    { path: "byoc/view/:productId", component: ByocProductComponent, canActivate: [AuthGuard] },
    { path: "aboutus", component: AboutUsComponent},
    { path: "profile", component: ProfileComponent, canActivate: [AuthGuard]},
    { path: "profile/discount/:userId", component: ProfileDiscountComponent, canActivate: [AuthGuard]},
    { path: "verify/:userId", component: VerifyComponent},
    { path: "cart", component: CartComponent, canActivate: [AuthGuard]},
    { path: "cart/checkout/:userId", component: CheckoutComponent, canActivate: [AuthGuard]},
    { path: "admin", loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate: [AdminGuard]},
    { path: 'inventory', loadChildren: () => import('./admin/inventory-products.module').then(m => m.InventoryProductsModule), canActivate: [AdminGuard]},
    { path: 'products', loadChildren: () => import('./admin/inventory-products.module').then(m => m.InventoryProductsModule), canActivate: [AdminGuard]},
    { path: "auth", loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
    { path: "payment-success/:orderId", component: PaymentSuccessComponent},
    { path: "my-orders", component: ClientOrdersComponent, canActivate: [AuthGuard]},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports:[RouterModule],
    providers: [AuthGuard, AdminGuard]
})

export class AppRoutingModule {

}
//AdminGuard
//canActivate: [AdminGuard]
