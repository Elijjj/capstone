import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { ProductsService } from "../admin/products/products.service";
import { Products } from "../admin/products/products.model";

@Component({
    selector:'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit, OnDestroy {
    products: Products[] = [];
    isLoading = false;
    private productsSub: Subscription;
    categorizedProducts: { category: string, products: Products[] }[] = [];
    categories = [
      { name: 'Premium Cheesecake', selected: true },
      { name: 'Signature Cheesecake', selected: true },
      { name: 'Mini Cheesecake', selected: true },
      { name: 'Cup O\' Berry Cheesecake', selected: true }
  ];

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

      filterProducts() {
        const selectedCategories = this.categories
            .filter(cat => cat.selected)
            .map(cat => cat.name);
        this.categorizedProducts = this.categorizeProducts(this.products, selectedCategories);
    }

    categorizeProducts(products: Products[], filterCategories?: string[]) {
        // Modify this function to allow filtering
        const categories = filterCategories || ["Premium Cheesecake", "Signature Cheesecake", "Mini Cheesecake", "Cup O' Berry Cheesecake"];
        const categorizedProducts = [];
      
        categories.forEach(category => {
            const categoryProducts = products.filter(product => product.productType === category);
            categorizedProducts.push({ category, products: categoryProducts });
        });
      
        return categorizedProducts;
    }

    isCategorySelected(categoryName: string): boolean {
      const cat = this.categories.find(cat => cat.name === categoryName);
      return cat ? cat.selected : false;
  }

    ngOnDestroy() {
        if (this.productsSub) {
            this.productsSub.unsubscribe();
        }
    }
}
