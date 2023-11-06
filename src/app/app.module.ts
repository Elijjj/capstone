import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material.model';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { CarouselComponent } from './homepage/carousel/carousel.component';
import { CarouselModule } from '@coreui/angular';
import { HomepageComponent } from './homepage/homepage.component';
import { MenuComponent } from './menu/menu.component';
import { ByocComponent } from './byoc/byoc.component';
import { AboutUsComponent } from './aboutus/aboutus.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuProductComponent } from './menu/menu-product/menu-product.component';
import { CartComponent } from './cart/cart.component';
import { ByocProductComponent } from './byoc/byoc-product/byoc-product.component';
import { ProfileDiscountComponent } from './profile/profile-discount/profile-discount.component';
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
