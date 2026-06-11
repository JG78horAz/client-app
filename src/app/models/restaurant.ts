export interface Restaurant {
  id: number;
  name: string;
  street: string;
  postalCode: string;
  city: string;
  latitude: number;
  longitude: number;
  webhookUrl: string;
  imageUrl: string;
  apiKey?: string;
}