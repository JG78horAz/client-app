import { Injectable } from '@angular/core';
import { MenuItem } from '../models/menu';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private restaurantId?: number;
  private readonly items: CartItem[] = [];

  addItem(restaurantId: number, menuItem: MenuItem) {
    if (this.restaurantId !== undefined && this.restaurantId !== restaurantId) {
      this.clear();
    }

    this.restaurantId = restaurantId;

    const existingItem = this.items.find(
      item => item.menuItem.id === menuItem.id
    );

    if (existingItem) {
      existingItem.quantity++;
      return;
    }

    this.items.push({
      menuItem,
      quantity: 1,
    });
  }

  getRestaurantId() {
    return this.restaurantId;
  }

  getItems() {
    return this.items;
  }

  clear() {
    this.items.length = 0;
    this.restaurantId = undefined;
  }
}