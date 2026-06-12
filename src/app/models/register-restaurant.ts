export interface RegisterRestaurantRequest {
  name: string;
  street: string;
  postalCode: string;
  city: string;
  latitude: number;
  longitude: number;
  webhookUrl: string;
  imageUrl?: string;
  openingTimes: RegisterOpeningTimeRequest[];
}

export interface RegisterOpeningTimeRequest {
  dayOfWeek: number;
  opensAt: string;
  closesAt: string;
}

export interface RegisterRestaurantResponse {
  restaurantId: number;
  apiKey: string;
}