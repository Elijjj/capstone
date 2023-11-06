import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { InventoryService } from '../inventory.service';
import { Inventory } from '../inventory.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-inventory-update',
  templateUrl: './inventory-update.component.html',
  styleUrls: [
    './inventory-update.component.css',
    '../../admin-homepage.component.css',
  ],
})
export class InventoryUpdateComponent implements OnInit, OnDestroy {
  enteredItem = '';
  enteredQuantity = '';
  enteredDescription = '';
  private mode = 'create';
  private itemId: string;
  private authStatusSub: Subscription;
  inventory: Inventory;
  isLoading = false;
  form: FormGroup;
  constructor(
    public inventoryService: InventoryService,
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
      item: new FormControl(null, {validators: [Validators.required] }),
      description: new FormControl(null, { validators: [Validators.required] }),
      quantity: new FormControl(null, { validators: [Validators.required] }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('itemId')) {
        this.mode = 'edit';
        this.itemId = paramMap.get('itemId');
        this.isLoading = true;
        this.inventoryService
          .getItem(this.itemId)
          .subscribe((inventoryData) => {
            this.isLoading = false;
            this.inventory = {
              id: inventoryData._id,
              item: inventoryData.item,
              description: inventoryData.description,
              quantity: inventoryData.quantity,
            };
            this.form.setValue({
              item: this.inventory.item,
              description: this.inventory.description,
              quantity: this.inventory.quantity,
            });
          });
      } else {
        this.mode = 'create';
        this.itemId = null;
      }
    });
  }

  onSaveItem() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.inventoryService.addItem(
        this.form.value.item,
        this.form.value.description,
        this.form.value.quantity
      );
    } else {
      this.inventoryService.updateItem(
        this.itemId,
        this.form.value.item,
        this.form.value.description,
        this.form.value.quantity
      );
    }
    this.form.reset();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
