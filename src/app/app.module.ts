import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from '@coreui/angular';
import { AboutUsComponent } from './aboutus/aboutus.component';
import { AngularMaterialModule } from './angular-material.model';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ByocProductComponent } from './byoc/byoc-product/byoc-product.component';
import { ByocComponent } from './byoc/byoc.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './cart/checkout/checkout.component';
import { PaymentSuccessComponent } from './cart/payment-success/payment-success.component';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { CarouselComponent } from './homepage/carousel/carousel.component';
import { HomepageComponent } from './homepage/homepage.component';
import { MenuProductComponent } from './menu/menu-product/menu-product.component';
import { MenuComponent } from './menu/menu.component';
import { ProfileDiscountComponent } from './profile/profile-discount/profile-discount.component';
import { ProfileComponent } from './profile/profile.component';
import { ClientOrdersComponent } from './client-orders/client-orders.component';
import { VerifyComponent } from './verify/verify.component';
import { CapitalizeFirstDirective } from './auth/signup/capitalize-first.directive';
// import { CartService } from './cart/cart.service';
// import { AdminHeaderComponent } from './header/admin-header.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
    FooterComponent,
    CarouselComponent,
    HomepageComponent,
    ByocComponent,
    ByocProductComponent,
    AboutUsComponent,
    ProfileComponent,
    ProfileDiscountComponent,
    MenuComponent,
    MenuProductComponent,
    CartComponent,
    CheckoutComponent,
    PaymentSuccessComponent,
    ClientOrdersComponent,
    VerifyComponent,
    CapitalizeFirstDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    CarouselModule,
  ],
  providers: [
    // CartService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
