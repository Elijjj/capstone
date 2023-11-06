import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { Products } from "../admin/products/products.model";
import { ProductsService } from "../admin/products/products.service";

@Component({
    selector:'app-byoc',
    templateUrl: './byoc.component.html',
    styleUrls: ['./byoc.component.css']
})

export class ByocComponent implements OnInit, OnDestroy {
    products: Products[] = [];
    isLoading = false;
    private productsSub: Subscription;
    categorizedProducts: { category: string, products: Products[] }[] = [];

    constructor(private productsService: ProductsService) {}

    ngOnInit() {
        this.isLoading = true;
      
        // Fetch product data from the service
        this.productsService.getProductsForMenu().subscribe(
          (transformedProductsData) => {
            console.log(transformedProductsData);
            this.categorizedProducts = this.categorizeProducts(transformedProductsData.products);
            this.isLoading = false;
          },
          (error) => {
            console.error("Error fetching products: ", error);
            this.isLoading = false;
          }
        );
      }

      categorizeProducts(products: Products[]) {
        // Categorize products based on productType
        const categories = ["Build-Your-Own"];
        const categorizedProducts = [];
      
        categories.forEach(category => {
          const categoryProducts = products.filter(product => product.productType === category);
          categorizedProducts.push({ category, products: categoryProducts });
        });
      
        return categorizedProducts;
      }

    ngOnDestroy() {
        if (this.productsSub) {
            this.productsSub.unsubscribe();
        }
    }
}