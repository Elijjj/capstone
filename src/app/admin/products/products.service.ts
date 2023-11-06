import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Products } from './products.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';

const BACKEND_URL = environment.apiUrl + '/products/';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private products: Products[] = [];
  private productsUpdated = new Subject<{
    products: Products[];
    productsCount: number;
  }>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  private updateProductList(products: Products[], productsCount: number) {
    this.products = products;
    this.productsUpdated.next({
        products: [...this.products],
        productsCount: productsCount
    });
}

getProducts(productsPerPage: number, currentPage: number, searchTerm: string = null) {
  const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}${searchTerm ? '&searchTerm=' + searchTerm : ''}`;
  this.httpClient
    .get<{ message: string; products: any; maxProducts: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(productData => {
          return {
              products: productData.products,
              maxProducts: productData.maxProducts
          };
      })
    )
    .subscribe(transformedProductData => {
        this.updateProductList(transformedProductData.products, transformedProductData.maxProducts);
    });
}
  getProductsUpdateListener() {
    return this.productsUpdated.asObservable();
  }

  getProduct(id: String) {
    return this.httpClient.get<{
      productType: string,
      productName: string,
      _id: string,
      productDescription: string,
      imagePath: string,
      price: number,
      quantity: number,
      size: string

    }>(BACKEND_URL + id);
  }
  addProduct(productType: string, productName: string, productDescription: string, image: File, price: number, quantity: number, size: string){
        const productData = new FormData();
        productData.append("productType", productType);
        productData.append("productName", productName);
        productData.append("productDescription", productDescription);
        productData.append("image", image, productName);
        productData.append("price", price.toString());
        productData.append("quantity", quantity.toString());
        productData.append("size", size);
        this.httpClient.post<{message: string, products: Products }>(BACKEND_URL, productData)
        .subscribe((response) => {
            this.router.navigate(["/admin/products"]);
        });
    }
  
    updateProduct(id: string, productType: string, productName: string, productDescription: string, image: any, price: number, quantity: number, size: string){
        let productData: Products | FormData;
        if(typeof(image) === 'object'){
            productData = new FormData();
            productData.append("id", id);
            productData.append("productType", productType);
            productData.append("productName", productName);
            productData.append("productDescription", productDescription);
            productData.append("image", image, productName);
            productData.append("price", price.toString());
            productData.append("quantity", quantity.toString());
            productData.append("size", size);

        } else {
            productData = {id: id, productType: productType, productName: productName, productDescription: productDescription, imagePath: image, price: price, quantity: quantity, size: size};
        }
        this.httpClient.put(BACKEND_URL + id, productData)
        .subscribe(response => {
            this.router.navigate(["/admin/products"]);
        });
    }


  deleteProduct(productId: string) {
    return this.httpClient.delete(BACKEND_URL + productId);
  }

  getProductsForMenu() {
    return this.httpClient
      .get<{ message: string; products: any[] }>(BACKEND_URL)
      .pipe(
        map((productsData) => {
          return {
            products: productsData.products.map((product) => {
              return {
                id: product._id,
                productType: product.productType,
                productName: product.productName,
                productDescription: product.productDescription,
                imagePath: product.imagePath,
                price: product.price,
                quantity: product.quantity,
                size: product.size,
              };
            }),
            productsCount: productsData.products.length, // Count of all products
          };
        })
      );
  }
}