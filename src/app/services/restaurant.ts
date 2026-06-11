import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Restaurant } from '../models/restaurant';
import { MenuResponse } from '../models/menu';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7077/api';

  getRestaurants() {
    return this.http.get<Restaurant[]>(`${this.apiUrl}/restaurants`);
  }

  getMenu(restaurantId: number) {
    return this.http.get<MenuResponse>(`${this.apiUrl}/restaurants/${restaurantId}/menu`);
  }
}
