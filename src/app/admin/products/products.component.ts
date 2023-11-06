import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import { Subscription } from 'rxjs';
import { PageEvent } from "@angular/material/paginator";
import { Products } from "./products.model";
import { ProductsService } from "./products.service";
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
    selector:'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css', '../admin-homepage.component.css']
})

export class ProductsComponent implements OnInit, OnDestroy{
    products: Products[] = [];
    searchTerm: string = "";
    private currentSearchTerm: string = null;
    filteredProducts: Products[] = [];
    searchForm: FormGroup;
    isLoading=false;
    totalProducts = 1;
    productsPerPage = 4;
    currentPage = 1;
    pageSizeOptions = [1, 2, 4];
    userIsAuthenticated = false;
    private productsSub: Subscription;
    private authStatusSub: Subscription;

    constructor(public productsService: ProductsService, private authService: AuthService,
        private fb: FormBuilder) {}

    ngOnInit(){
        this.isLoading=true;
        this.searchForm = this.fb.group({
            searchTerm: ['']
          });
        this.productsService.getProducts(this.productsPerPage, this.currentPage);
        this.productsSub = this.productsService.getProductsUpdateListener()
        .subscribe((productData: {products: Products[], productsCount: number}) => {
            this.isLoading=false;
            this.totalProducts = productData.productsCount;
            this.products = productData.products;
            this.filteredProducts = [...productData.products];
        });
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService.getAuthStatusListener()
        .subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
        });
    }
    onChangedPage(pageData: PageEvent){
        this.isLoading=true;
        const searchTerm = this.searchForm.value.searchTerm;
        this.currentPage = pageData.pageIndex + 1;
        this.productsPerPage = pageData.pageSize;
        this.productsService.getProducts(this.productsPerPage, this.currentPage, searchTerm);
    }
    
    onDelete(postId: string){
        this.isLoading=true;
        this.productsService.deleteProduct(postId).subscribe(() => {
            this.productsService.getProducts(this.productsPerPage, this.currentPage);
        }, () => {
            this.isLoading = false;
        });
    }

    onSearch() {
        const searchTerm = this.searchForm.value.searchTerm;
        // Reset to the first page when initiating a new search
        this.currentPage = 1;
        this.productsService.getProducts(this.productsPerPage, this.currentPage, searchTerm);
      }

    onLogout() {
        this.authService.logout();
      }

    ngOnDestroy(){
        this.productsSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }
}