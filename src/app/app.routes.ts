import { Routes } from '@angular/router';
import { Restaurants } from './pages/restaurants/restaurants';
import { Menu } from './pages/menu/menu';
import { Order } from './pages/order/order';
import { Admin } from './pages/admin/admin';
import { authGuard } from './guards/auth.guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'restaurants',
    pathMatch: 'full',
  },
  {
    path: 'restaurants',
    component: Restaurants,
  },
  {
    path: 'restaurants/:id/menu',
    component: Menu,
  },
  {
    path: 'order',
    component: Order,
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'restaurants',
  },
];