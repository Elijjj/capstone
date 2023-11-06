import { NgModule } from "@angular/core";
import { InventoryComponent } from "./inventory/inventory.component";
import { InventoryUpdateComponent } from "./inventory/inventory-update/inventory-update.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "src/app/angular-material.model";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AdminRoutingModule } from "./admin-routing.module";
import { ProductsComponent } from "./products/products.component";
import { ProductsUpdateComponent } from "./products/products-update/products-update.component";

@NgModule({
    declarations: [
        InventoryComponent,
        InventoryUpdateComponent,
        ProductsComponent,
        ProductsUpdateComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule,
        AdminRoutingModule
    ]
})
export class InventoryProductsModule {
    
}