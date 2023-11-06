import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Inventory } from './inventory.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';

const BACKEND_URL = environment.apiUrl + '/inventory/';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private inventory: Inventory[] = [];
  private inventoryUpdated = new Subject<{
    inventory: Inventory[];
    inventoryCount: number;
  }>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getInventoryItems(itemsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${itemsPerPage}&page=${currentPage}`;
    this.httpClient.get<{message: String, inventory: any, maxItems: number }>(BACKEND_URL + queryParams)
    .pipe(map(inventoryData => {
        return { inventory: inventoryData.inventory.map(item => {
            return {
                item: item.item,
                description: item.description,
                id: item._id,
                quantity: item.quantity
            };
        }), maxItems: inventoryData.maxItems};
    })).subscribe(transformedInventoryData => {
        console.log(transformedInventoryData);
        this.inventory = transformedInventoryData.inventory;
        this.inventoryUpdated.next({inventory: [...this.inventory], inventoryCount: transformedInventoryData.maxItems});
    });
  }

  getInventoryUpdateListener() {
    return this.inventoryUpdated.asObservable();
  }

  getItem(id: String) {
    return this.httpClient.get<{
      _id: string;
      item: string;
      description: string;
      quantity: number;
    }>(BACKEND_URL + id);
  }
  addItem(item: string, description: string, quantity: number) {
    const inventoryData = {
      item: item,
      description: description,
      quantity: quantity
    };
  
    this.httpClient
      .post<{ message: string; inventory: Inventory }>(
        BACKEND_URL,
        inventoryData,
        { headers: { 'Content-Type': 'application/json' } }
      )
      .subscribe((response) => {
        this.router.navigate(['/admin/inventory']);
      });
  }
  
  updateItem(id: string, item: string, description: string, quantity: number) {
    const inventoryData: Inventory | FormData = {
        id: id,
        item: item,
        description: description,
        quantity: quantity
    };

    this.httpClient
        .put(BACKEND_URL + id, inventoryData)
        .subscribe((response) => {
            this.router.navigate(['/admin/inventory']);
        });
}


  deleteItem(itemId: string) {
    return this.httpClient.delete(BACKEND_URL + itemId);
  }
}
