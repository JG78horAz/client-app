export interface OpeningTimeResponse {
  id: number;
  dayOfWeek: number;
  opensAt: string;
  closesAt: string;
}

export interface UpdateOpeningTimesRequest {
  openingTimes: UpdateOpeningTimeRequest[];
}

export interface UpdateOpeningTimeRequest {
  dayOfWeek: number;
  opensAt: string;
  closesAt: string;
}