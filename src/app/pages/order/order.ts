import { Component, inject, signal } from '@angular/core';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';
import { CreateOrderResponse, PricePreviewResponse } from '../../models/order';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order',
  imports: [DecimalPipe, FormsModule],
  templateUrl: './order.html',
  styleUrl: './order.css'
})
export class Order {
  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);

  items = this.cartService.getItems();
  pricePreview = signal<PricePreviewResponse | undefined>(undefined);

  studentId = 1;
  deliveryAddressText = 'FH Hagenberg';
  deliveryLatitude = 48.3676;
  deliveryLongitude = 14.5168;

  getTotal() {
    return this.items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
  }

  loadPricePreview() {
    const request = {
      deliveryAddressText: this.deliveryAddressText,
      studentLatitude: this.deliveryLatitude,
      studentLongitude: this.deliveryLongitude,
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

  orderResponse?: CreateOrderResponse;

  createOrder() {
    const restaurantId = this.cartService.getRestaurantId();

    if (restaurantId === undefined) {
      return;
    }

    const request = {
      studentId: this.studentId,
      restaurantId: restaurantId,
      deliveryAddressText: this.deliveryAddressText,
      deliveryLatitude: this.deliveryLatitude,
      deliveryLongitude: this.deliveryLongitude,
      items: this.items.map(item => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
      })),
    };

    this.orderService.createOrder(request).subscribe(response => {
      this.orderResponse = response;
      this.cartService.clear();
      this.pricePreview.set(undefined);
    });
  }
}