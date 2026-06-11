import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RestaurantService } from '../../services/restaurant';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-restaurants',
  imports: [AsyncPipe, RouterLink ],
  templateUrl: './restaurants.html',
  styleUrl: './restaurants.css'
})
export class Restaurants {
  private readonly restaurantService = inject(RestaurantService);

  restaurants$ = this.restaurantService.getRestaurants();
}