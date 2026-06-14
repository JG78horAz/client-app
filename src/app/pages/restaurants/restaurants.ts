import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RestaurantService } from '../../services/restaurant';
import { Restaurant } from '../../models/restaurant';

@Component({
  selector: 'app-restaurants',
  imports: [FormsModule, RouterLink],
  templateUrl: './restaurants.html',
  styleUrl: './restaurants.css',
})
export class Restaurants {
  private readonly restaurantService = inject(RestaurantService);

  restaurants = signal<Restaurant[]>([]);
  errorMessage = signal('');

  latitude = 48.3683;
  longitude = 14.5144;
  radiusKm = 1;
  onlyOpenNow = false;

  constructor() {
    this.loadAllRestaurants();
  }

  loadAllRestaurants() {
    this.errorMessage.set('');

    this.restaurantService.getRestaurants().subscribe({
      next: restaurants => {
        this.restaurants.set(restaurants);
      },
      error: () => {
        this.errorMessage.set('Restaurants konnten nicht geladen werden.');
      },
    });
  }

  searchRestaurants() {
    this.errorMessage.set('');

    if (this.radiusKm <= 0) {
      this.errorMessage.set('Der Suchradius muss größer als 0 sein.');
      return;
    }

    this.restaurantService
      .searchRestaurants(
        this.latitude,
        this.longitude,
        this.radiusKm,
        this.onlyOpenNow
      )
      .subscribe({
        next: restaurants => {
          this.restaurants.set(restaurants);
        },
        error: () => {
          this.errorMessage.set('Restaurantsuche konnte nicht durchgeführt werden.');
        },
      });
  }

  useCurrentLocation() {
    if (!navigator.geolocation) {
      this.errorMessage.set('Der Browser unterstützt keine Standortabfrage.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.searchRestaurants();
      },
      () => {
        this.errorMessage.set('Standort konnte nicht ermittelt werden.');
      }
    );
  }
}