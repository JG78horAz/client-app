import { Component, inject } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../services/restaurant';
import { CartService } from '../../services/cart';
import { MenuItem } from '../../models/menu';

@Component({
  selector: 'app-menu',
  imports: [AsyncPipe, DecimalPipe],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  private readonly route = inject(ActivatedRoute);
  private readonly restaurantService = inject(RestaurantService);
  private readonly cartService = inject(CartService);

  restaurantId = Number(this.route.snapshot.paramMap.get('id'));
  menu$ = this.restaurantService.getMenu(this.restaurantId);

  addToCart(item: MenuItem) {
    this.cartService.addItem(this.restaurantId, item);
  }
}
