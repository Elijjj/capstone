import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { ProductsService } from '../products.service';
import { Products } from '../products.model';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-products-update',
  templateUrl: './products-update.component.html',
  styleUrls: [
    './products-update.component.css',
    '../../admin-homepage.component.css',
  ],
})
export class ProductsUpdateComponent implements OnInit, OnDestroy {
  enteredProductName = '';
  enteredProductDescription = '';
  enteredPrice = '';
  enteredQuantity = '';
  private mode = 'create';
  private productId: string;
  private authStatusSub: Subscription;
  products: Products;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  isMenuCollapsed = true; // Add this line
  constructor(
    private snackBar: MatSnackBar,
    public productsService: ProductsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
        productType: new FormControl(null, {validators: [Validators.required]}),
        productName: new FormControl(null, {validators: [Validators.required]}),
        productDescription: new FormControl(null, {validators: [Validators.required]}),
        image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
        price: new FormControl(null, { validators: [Validators.required]}),
        quantity: new FormControl(null, { validators: [Validators.required]}),
        size: new FormControl(null, { validators: [Validators.required]}),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('productId')) {
        this.mode = 'edit';
        this.productId = paramMap.get('productId');
        this.isLoading = true;
        this.productsService
          .getProduct(this.productId)
          .subscribe((productData) => {
            this.isLoading = false;
            this.products = {
              id: productData._id,
              productType: productData.productType,
              productName: productData.productName,
              productDescription: productData.productDescription,
              imagePath: productData.imagePath,
              price: productData.price,
              quantity: productData.quantity,
              size: productData.size
            };
            this.form.setValue({
              productType: this.products.productType,
              productName: this.products.productName,
              productDescription: this.products.productDescription,
              image: this.products.imagePath,
              price: this.products.price,
              quantity: this.products.quantity,
              size: this.products.size
            });
          });
      } else {
        this.mode = 'create';
        this.productId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveProduct() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.productsService.addProduct(
        this.form.value.productType,
        this.form.value.productName,
        this.form.value.productDescription,
        this.form.value.image,
        this.form.value.price,
        this.form.value.quantity,
        this.form.value.size,
      );
      this.snackBar.open('Product Added!', 'Close', { duration: 3000 });
    } else {
      this.productsService.updateProduct(
        this.productId,
        this.form.value.productType,
        this.form.value.productName,
        this.form.value.productDescription,
        this.form.value.image,
        this.form.value.price,
        this.form.value.quantity,
        this.form.value.size,
      );
      this.snackBar.open('Product Updated!', 'Close', { duration: 3000 });
    }
    this.form.reset();
  }

  onLogout() {
    this.authService.logout();
  }
  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
