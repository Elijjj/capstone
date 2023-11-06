import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { Inventory } from "./inventory.model";
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "src/app/auth/auth.service";
import { InventoryService } from "./inventory.service";

@Component({
    selector:'app-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.css', '../admin-homepage.component.css']
})

export class InventoryComponent implements OnInit, OnDestroy{
    inventory: Inventory[] = [];
    isLoading=false;
    totalItems = 10;
    itemsPerPage = 5;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5,];
    userIsAuthenticated = false;
    private inventorySub: Subscription;
    private authStatusSub: Subscription;

    constructor(public inventoryService: InventoryService, private authService: AuthService) {}

    ngOnInit(){
        this.isLoading=true;
        this.inventoryService.getInventoryItems(this.itemsPerPage, this.currentPage);
        this.inventorySub = this.inventoryService.getInventoryUpdateListener()
        .subscribe((inventoryData: {inventory: Inventory[], inventoryCount: number}) => {
            this.isLoading=false;
            this.totalItems = inventoryData.inventoryCount;
            this.inventory = inventoryData.inventory;
        });
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService.getAuthStatusListener()
        .subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
        });
    }
    onChangedPage(pageData: PageEvent){
        this.isLoading=true;
        this.currentPage = pageData.pageIndex + 1;
        this.itemsPerPage = pageData.pageSize;
        this.inventoryService.getInventoryItems(this.itemsPerPage, this.currentPage);
    }
    
    onDelete(postId: string){
        this.isLoading=true;
        this.inventoryService.deleteItem(postId).subscribe(() => {
            this.inventoryService.getInventoryItems(this.itemsPerPage, this.currentPage);
        }, () => {
            this.isLoading = false;
        });
    }

    onLogout() {
        this.authService.logout();
      }

    ngOnDestroy(){
        this.inventorySub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }
}