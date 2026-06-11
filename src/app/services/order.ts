import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { 
  CreateOrderRequest,
  CreateOrderResponse,
  PricePreviewRequest,
  PricePreviewResponse,
} from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7077/api';

  getPricePreview(restaurantId: number, request: PricePreviewRequest) {
    return this.http.post<PricePreviewResponse>(
      `${this.apiUrl}/restaurants/${restaurantId}/price-preview`,
      request
    );
  }

  createOrder(request: CreateOrderRequest) {
    return this.http.post<CreateOrderResponse>(
      `${this.apiUrl}/orders`,
      request
    );
  }
}
