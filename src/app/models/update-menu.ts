export interface UpdateMenuRequest {
  categories: UpdateMenuCategoryRequest[];
}

export interface UpdateMenuCategoryRequest {
  name: string;
  sortOrder: number;
  items: UpdateMenuItemRequest[];
}

export interface UpdateMenuItemRequest {
  name: string;
  description?: string;
  price: number;
  sortOrder: number;
}