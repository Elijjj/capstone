import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { ProductsService } from "src/app/admin/products/products.service";
import { Products } from "src/app/admin/products/products.model";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { CartService } from "src/app/cart/cart.service";
import { AuthService } from "src/app/auth/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector:'app-byoc-product',
    templateUrl: './byoc-product.component.html',
    styleUrls: ['./byoc-product.component.css']
})

export class ByocProductComponent implements OnInit, OnDestroy {
    products: Products;
    isLoading = false;
    selectedQuantity: number = 1;
    size: string;
    toppings: string;
    crust: string;
    flowers: string;
    private mode = 'view';
    private productId: string;
    private productsSub: Subscription;


    constructor(private snackBar: MatSnackBar, private productsService: ProductsService, public route: ActivatedRoute, private cartService: CartService, private authService: AuthService) {}

    ngOnInit() {
        this.isLoading = true;
      
        // Fetch product data from the service
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            this.mode = 'view';
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
              });
        });
      }

      onAddToCart() {
        if (this.authService.getIsAuth()) {
            // If user is authenticated, add to cart
            const cartItem = {
                userId: this.authService.getUserId(),
                id: this.products.id,
                productName: this.products.productName,
                imagePath: this.products.imagePath,
                price: this.products.price,
                originalPrice: this.products.price,
                selectedQuantity: this.selectedQuantity,
                quantity: this.products.quantity,
                size: this.size,
                productDescription: this.products.productDescription,
                productType: this.products.productType,
                toppings: this.toppings,
                crust: this.crust,
                flowers: this.flowers,
            };
            this.cartService.addToCart(cartItem.userId, cartItem.id, cartItem.selectedQuantity, cartItem.quantity, cartItem.originalPrice, cartItem.price,cartItem.imagePath, cartItem.size, cartItem.productDescription, cartItem.productName, cartItem.productType, cartItem.toppings, cartItem.crust, cartItem.flowers);
            this.snackBar.open('Cart Updated!', 'Close', { duration: 3000 });
        } else {
            this.snackBar.open('You need to be logged in to add products to cart.', 'Close', { duration: 3000, panelClass: ['mat-toolbar', 'mat-warn'] });
        }
    }
    
    ngOnDestroy() {
        if (this.productsSub) {
            this.productsSub.unsubscribe();
        }
    }
}
