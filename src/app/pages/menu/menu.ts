import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../services/restaurant';

@Component({
  selector: 'app-menu',
  imports: [AsyncPipe],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  private readonly route = inject(ActivatedRoute);
  private readonly restaurantService = inject(RestaurantService);

  restaurantId = Number(this.route.snapshot.paramMap.get('id'));
  menu$ = this.restaurantService.getMenu(this.restaurantId);
}
