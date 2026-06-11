import { Component, inject, signal } from '@angular/core';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';
import { PricePreviewResponse } from '../../models/order';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-order',
  imports: [DecimalPipe],
  templateUrl: './order.html',
  styleUrl: './order.css'
})
export class Order {
  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);

  items = this.cartService.getItems();
  pricePreview = signal<PricePreviewResponse | undefined>(undefined);

  getTotal() {
    return this.items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
  }

  loadPricePreview() {
    const request = {
      deliveryAddressText: 'FH Hagenberg',
      studentLatitude: 48.3676,
      studentLongitude: 14.5168,
      items: this.items.map(item => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
      })),
    };

    const restaurantId = this.cartService.getRestaurantId();

    if (restaurantId === undefined) {
      return;
    }

    this.orderService.getPricePreview(restaurantId, request).subscribe(response => {
      this.pricePreview.set(response);
    });
  }

  clearCart() {
    this.cartService.clear();
    this.pricePreview.set(undefined);
  }
}