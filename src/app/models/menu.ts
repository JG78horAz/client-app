export interface MenuResponse {
  restaurantId: number;
  categories: MenuCategory[];
}

export interface MenuCategory {
  id: number;
  name: string;
  sortOrder: number;
  items: MenuItem[];
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  sortOrder: number;
}