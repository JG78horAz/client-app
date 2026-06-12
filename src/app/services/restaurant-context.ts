import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RestaurantContextService {
  private restaurantId?: number;
  private apiKey?: string;

  setContext(restaurantId: number, apiKey: string) {
    this.restaurantId = restaurantId;
    this.apiKey = apiKey;
  }

  getRestaurantId() {
    return this.restaurantId;
  }

  getApiKey() {
    return this.apiKey;
  }

  hasContext() {
    return this.restaurantId !== undefined && this.apiKey !== undefined;
  }

  clear() {
    this.restaurantId = undefined;
    this.apiKey = undefined;
  }
}
