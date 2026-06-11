import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Restaurants } from './pages/restaurants/restaurants';
import { Menu } from './pages/menu/menu';
import { Order } from './pages/order/order';
import { Admin } from './pages/admin/admin';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'restaurants', component: Restaurants },
  { path: 'restaurants/:id/menu', component: Menu },
  { path: 'order', component: Order },
  { path: 'admin', component: Admin },
  { path: '**', redirectTo: '' },
];