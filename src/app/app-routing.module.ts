import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomepageComponent } from "./homepage/homepage.component";
import { AuthGuard } from "./auth/auth.guard";
import { MenuComponent } from "./menu/menu.component";
import { ByocComponent } from "./byoc/byoc.component";
import { AboutUsComponent } from "./aboutus/aboutus.component";
import { ProfileComponent } from "./profile/profile.component";
import { AdminGuard } from "./admin/admin.guard";
import { MenuProductComponent } from "./menu/menu-product/menu-product.component";
import { CartComponent } from "./cart/cart.component";
import { ByocProductComponent } from "./byoc/byoc-product/byoc-product.component";
import { ProfileDiscountComponent } from "./profile/profile-discount/profile-discount.component";
import { CheckoutComponent } from "./cart/checkout/checkout.component";
// import { AdminGuard } from "./admin/admin.guard";

const routes: Routes = [
    { path: "", component: HomepageComponent },
    { path: "menu", component: MenuComponent },
    { path: "menu/view/:productId", component: MenuProductComponent },
    { path: "byoc", component: ByocComponent },
    { path: "byoc/view/:productId", component: ByocProductComponent },
    { path: "aboutus", component: AboutUsComponent},
    { path: "profile", component: ProfileComponent, canActivate: [AuthGuard]},
    { path: "profile/discount/:userId", component: ProfileDiscountComponent, canActivate: [AuthGuard]},
    { path: "cart", component: CartComponent, canActivate: [AuthGuard]},
    { path: "cart/checkout/:userId", component: CheckoutComponent, canActivate: [AuthGuard]},
    { path: "admin", loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)},
    { path: 'inventory', loadChildren: () => import('./admin/inventory-products.module').then(m => m.InventoryProductsModule)},
    { path: 'products', loadChildren: () => import('./admin/inventory-products.module').then(m => m.InventoryProductsModule)},
    { path: "auth", loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)}
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