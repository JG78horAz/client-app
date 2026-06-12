import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Restaurant } from '../models/restaurant';
import { MenuResponse } from '../models/menu';
import {
  RegisterRestaurantRequest,
  RegisterRestaurantResponse,
} from '../models/register-restaurant';
import { 
  OpeningTimeResponse,
  UpdateOpeningTimesRequest,
} from '../models/opening-time';

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

  registerRestaurant(request: RegisterRestaurantRequest) {
    return this.http.post<RegisterRestaurantResponse>(
      `${this.apiUrl}/restaurants/register`,
      request
    );
  }

  getOpeningTimes(restaurantId: number) {
    return this.http.get<OpeningTimeResponse[]>(
      `${this.apiUrl}/restaurants/${restaurantId}/opening-times`
    );
  }

  updateOpeningTimes(
    restaurantId: number,
    apiKey: string,
    request: UpdateOpeningTimesRequest
  ) {
    return this.http.put(
      `${this.apiUrl}/restaurants/${restaurantId}/opening-times`,
      request,
      {
        headers: {
          'x-Api-Key': apiKey,
        },
      }
    );
  }
}
