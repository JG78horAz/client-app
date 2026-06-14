import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
import { UpdateMenuRequest } from '../models/update-menu';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7077/api';

  getRestaurants() {
    return this.http.get<Restaurant[]>(`${this.apiUrl}/restaurants`);
  }

  searchRestaurants(
    latitude: number,
    longitude: number,
    radiusKm: number,
    onlyOpenNow: boolean
  ) {
    const params = new HttpParams()
      .set('latitude', latitude)
      .set('longitude', longitude)
      .set('radiusKm', radiusKm)
      .set('onlyOpenNow', onlyOpenNow);

    return this.http.get<Restaurant[]>(`${this.apiUrl}/restaurants/search`, {
      params,
    });
  }

  getMenu(restaurantId: number) {
    return this.http.get<MenuResponse>(
      `${this.apiUrl}/restaurants/${restaurantId}/menu`
    );
  }

  updateMenu(restaurantId: number, apiKey: string, request: UpdateMenuRequest) {
    return this.http.put(`${this.apiUrl}/restaurants/${restaurantId}/menu`, request, {
      headers: {
        'X-Api-Key': apiKey,
      },
    });
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
          'X-Api-Key': apiKey,
        },
      }
    );
  }
}