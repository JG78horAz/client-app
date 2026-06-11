export interface OrderItemRequest {
  menuItemId: number;
  quantity: number;
}

export interface PricePreviewRequest {
  deliveryAddressText: string;
  studentLatitude: number;
  studentLongitude: number;
  items: OrderItemRequest[];
}

export interface PricePreviewResponse {
  restaurantId: number;
  itemsTotal: number;
  deliveryFee: number;
  totalPrice: number;
}

export interface CreateOrderRequest {
  studentId: number;
  reestaurantId: number;
  deliveryAddressText: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  items: OrderItemRequest[];
}

export interface CreateOrderResponse {
  orderId: number;
}