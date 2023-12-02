import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { ProductsService } from "../admin/products/products.service";
import { Products } from "../admin/products/products.model";

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
    products: Products[] = [];
    isLoading = false;
    searchQuery: string = '';
    private productsSub: Subscription;
    categorizedProducts: { category: string, products: Products[] }[] = [];

    categories = [];

    // categories = [
    //   { name: 'Premium Cheesecake', selected: true },
    //   { name: 'Signature Cheesecake', selected: true },
    //   { name: 'Mini Cheesecake', selected: true },
    //   { name: 'Cup O\' Berry Cheesecake', selected: true },
    // ];

    sizeProducts: { size: string, products: Products[] }[] = [];
    sizes = [];

    constructor(private productsService: ProductsService) {}

    ngOnInit() {
      this.isLoading = true;
      this.productsService.getProductsForMenu().subscribe(
          (transformedProductsData) => {
              this.products = transformedProductsData.products;
  
              // Extract unique product types and set categories
              const uniqueProductTypes = Array.from(new Set(this.products.map(product => product.productType)));
              this.categories = uniqueProductTypes.map(type => ({
                  name: type, 
                  selected: true // All categories are initially selected
              }));
              
              // Extract unique sizes and set sizes
              const uniqueSizes = Array.from(new Set(this.products.map(product => product.size)));
              this.sizes = uniqueSizes.map(size => ({
                  name: size, 
                  selected: size !== '8 inch' // All sizes except '8 inch' are initially selected
              }));
              
              this.applyFilters();
              this.isLoading = false;
          },
          (error) => {
              console.error("Error fetching products: ", error);
              this.isLoading = false;
          }
      );
  }
  

    applyFilters() {
        const selectedCategories = this.categories
          .filter(cat => cat.selected)
          .map(cat => cat.name);
        const selectedSizes = this.sizes
          .filter(size => size.selected)
          .map(size => size.name);

        let tempFilteredProducts = this.products
          .filter(product => selectedCategories.includes(product.productType));

        if (selectedSizes.length > 0) {
          tempFilteredProducts = tempFilteredProducts
            .filter(product => selectedSizes.includes(product.size));
        }

        if (this.searchQuery) {
            tempFilteredProducts = tempFilteredProducts.filter(product =>
                product.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }

        this.categorizedProducts = this.categorizeProducts(tempFilteredProducts);
        this.sizeProducts = this.categorizeSizes(tempFilteredProducts);
    }

    categorizeProducts(products: Products[]) {
      // Filter out 'Build-Your-Own' from the categories list
      const filteredCategories = this.categories.filter(category => category.name !== 'Build-Your-Own');
  
      // Now map over the filtered categories
      return filteredCategories.map(category => ({
          category: category.name,
          products: products.filter(product => product.productType === category.name)
      }));
  }
  

  categorizeSizes(products: Products[]) {
    return this.sizes.map(size => ({
        size: size.name,
        products: products.filter(product => product.size === size.name)
    }));
}

    onFilterChange() {
        this.applyFilters();
    }

    ngOnDestroy() {
        if (this.productsSub) {
            this.productsSub.unsubscribe();
        }
    }
}
