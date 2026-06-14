import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';
import { CreateOrderResponse, PricePreviewResponse } from '../../models/order';

interface DeliveryLocation {
  label: string;
  addressText: string;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-order',
  imports: [DecimalPipe, FormsModule, RouterLink],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export class Order {
  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);

  items = this.cartService.getItems();

  pricePreview = signal<PricePreviewResponse | undefined>(undefined);
  orderResponse = signal<CreateOrderResponse | undefined>(undefined);

  private readonly studentId = 1;

  deliveryLocations: DeliveryLocation[] = [
    {
      label: 'FH Hagenberg / Softwarepark',
      addressText: 'FH Hagenberg, Softwarepark 11, 4232 Hagenberg im Mühlkreis',
      latitude: 48.3676,
      longitude: 14.5168,
    },
    {
      label: 'Schloss Hagenberg',
      addressText: 'Schloss Hagenberg, Kirchenplatz 5, 4232 Hagenberg im Mühlkreis',
      latitude: 48.366998,
      longitude: 14.51578,
    },
    {
      label: 'Softwarepark 30',
      addressText: 'Softwarepark 30, 4232 Hagenberg im Mühlkreis',
      latitude: 48.3702611,
      longitude: 14.5146346,
    },
  ];

  selectedDeliveryLocationIndex = 0;

  deliveryAddressText = this.deliveryLocations[0].addressText;
  deliveryLatitude = this.deliveryLocations[0].latitude;
  deliveryLongitude = this.deliveryLocations[0].longitude;

  selectDeliveryLocation() {
    const selectedLocation = this.deliveryLocations[this.selectedDeliveryLocationIndex];

    this.deliveryAddressText = selectedLocation.addressText;
    this.deliveryLatitude = selectedLocation.latitude;
    this.deliveryLongitude = selectedLocation.longitude;
    this.pricePreview.set(undefined);
    this.orderResponse.set(undefined);
  }

  getTotal() {
    return this.items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
  }

  loadPricePreview() {
    const restaurantId = this.cartService.getRestaurantId();

    if (restaurantId === undefined || this.items.length === 0) {
      return;
    }

    const request = {
      deliveryAddressText: this.deliveryAddressText,
      studentLatitude: this.deliveryLatitude,
      studentLongitude: this.deliveryLongitude,
      items: this.items.map(item => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
      })),
    };

    this.orderService.getPricePreview(restaurantId, request).subscribe(response => {
      this.pricePreview.set(response);
      this.orderResponse.set(undefined);
    });
  }

  createOrder() {
    const restaurantId = this.cartService.getRestaurantId();

    if (restaurantId === undefined || this.items.length === 0) {
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
      this.orderResponse.set(response);
      this.cartService.clear();
      this.pricePreview.set(undefined);
    });
  }

  clearCart() {
    this.cartService.clear();
    this.pricePreview.set(undefined);
    this.orderResponse.set(undefined);
  }
}