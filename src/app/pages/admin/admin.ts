import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant';
import { RegisterRestaurantResponse } from '../../models/register-restaurant';
import {
  OpeningTimeResponse,
  UpdateOpeningTimeRequest,
} from '../../models/opening-time';
import { RestaurantContextService } from '../../services/restaurant-context';

interface WeekdaySelection {
  value: number;
  label: string;
  selected: boolean;
}

@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  private readonly restaurantService = inject(RestaurantService);
  private readonly restaurantContextService = inject(RestaurantContextService);

  name = '';
  street = '';
  postalCode = '';
  city = '';
  latitude = 48.3676;
  longitude = 14.5168;
  webhookUrl = '';
  imageUrl = '';

  response = signal<RegisterRestaurantResponse | undefined>(undefined);
  errorMessage = signal('');
  openingTimesMessage = signal('');

  openingTimes = signal<OpeningTimeResponse[]>([]);

  weekdays: WeekdaySelection[] = [
    { value: 1, label: 'Montag', selected: false },
    { value: 2, label: 'Dienstag', selected: false },
    { value: 3, label: 'Mittwoch', selected: false },
    { value: 4, label: 'Donnerstag', selected: false },
    { value: 5, label: 'Freitag', selected: false },
    { value: 6, label: 'Samstag', selected: false },
    { value: 0, label: 'Sonntag', selected: false },
  ];

  newOpensAt = '';
  newClosesAt = '';

  registerRestaurant() {
    this.errorMessage.set('');
    this.response.set(undefined);
    this.openingTimesMessage.set('');

    const request = {
      name: this.name,
      street: this.street,
      postalCode: this.postalCode,
      city: this.city,
      latitude: this.latitude,
      longitude: this.longitude,
      webhookUrl: this.webhookUrl,
      imageUrl: this.imageUrl || undefined,
      openingTimes: this.openingTimes().map(openingTime => ({
        dayOfWeek: openingTime.dayOfWeek,
        opensAt: this.formatTime(openingTime.opensAt),
        closesAt: this.formatTime(openingTime.closesAt),
      })),
    };

    this.restaurantService.registerRestaurant(request).subscribe({
      next: response => {
        this.response.set(response);

        this.restaurantContextService.setContext(
          response.restaurantId,
          response.apiKey
        );

        this.loadOpeningTimes();
      },
      error: () => {
        this.errorMessage.set('Restaurant konnte nicht registriert werden.');
      },
    });
  }

  loadOpeningTimes() {
    const restaurantId = this.restaurantContextService.getRestaurantId();

    if (restaurantId === undefined) {
      this.openingTimesMessage.set('Bitte zuerst ein Restaurant registrieren.');
      return;
    }

    this.openingTimesMessage.set('');

    this.restaurantService.getOpeningTimes(restaurantId).subscribe({
      next: openingTimes => {
        this.openingTimes.set(openingTimes);
      },
      error: () => {
        this.openingTimesMessage.set(
          'Öffnungszeiten konnten nicht geladen werden.'
        );
      },
    });
  }

  addOpeningTime() {
    if (!this.newOpensAt || !this.newClosesAt) {
      this.openingTimesMessage.set(
        'Bitte Öffnungs- und Schließzeit eingeben.'
      );
      return;
    }

    const selectedWeekdays = this.weekdays.filter(day => day.selected);

    if (selectedWeekdays.length === 0) {
      this.openingTimesMessage.set(
        'Bitte mindestens einen Wochentag auswählen.'
      );
      return;
    }

    const newOpeningTimes = selectedWeekdays.map(day => ({
      id: 0,
      dayOfWeek: day.value,
      opensAt: this.formatTime(this.newOpensAt),
      closesAt: this.formatTime(this.newClosesAt),
    }));

    this.openingTimes.update(openingTimes => [
      ...openingTimes,
      ...newOpeningTimes,
    ]);

    this.newOpensAt = '';
    this.newClosesAt = '';

    for (const day of this.weekdays) {
      day.selected = false;
    }

    this.openingTimesMessage.set('');

    if (this.restaurantContextService.hasContext()) {
      this.saveOpeningTimes();
    }
  }

  removeOpeningTime(index: number) {
    this.openingTimes.update(openingTimes =>
      openingTimes.filter((_, currentIndex) => currentIndex !== index)
    );

    if (this.restaurantContextService.hasContext()) {
      this.saveOpeningTimes();
    }
  }

  private saveOpeningTimes() {
    const restaurantId = this.restaurantContextService.getRestaurantId();
    const apiKey = this.restaurantContextService.getApiKey();

    if (restaurantId === undefined || apiKey === undefined) {
      this.openingTimesMessage.set('Bitte zuerst ein Restaurant registrieren.');
      return;
    }

    const request = {
      openingTimes: this.openingTimes().map(openingTime => ({
        dayOfWeek: openingTime.dayOfWeek,
        opensAt: this.formatTime(openingTime.opensAt),
        closesAt: this.formatTime(openingTime.closesAt),
      } satisfies UpdateOpeningTimeRequest)),
    };

    this.restaurantService
      .updateOpeningTimes(restaurantId, apiKey, request)
      .subscribe({
        next: () => {
          this.openingTimesMessage.set('Öffnungszeiten wurden gespeichert.');
          this.loadOpeningTimes();
        },
        error: () => {
          this.openingTimesMessage.set(
            'Öffnungszeiten konnten nicht gespeichert werden.'
          );
        },
      });
  }

  hasOpeningTimeForDay(dayOfWeek: number) {
    return this.openingTimes().some(
      openingTime => openingTime.dayOfWeek === dayOfWeek
    );
  }

  getDayName(dayOfWeek: number) {
    switch (dayOfWeek) {
      case 0:
        return 'Sonntag';
      case 1:
        return 'Montag';
      case 2:
        return 'Dienstag';
      case 3:
        return 'Mittwoch';
      case 4:
        return 'Donnerstag';
      case 5:
        return 'Freitag';
      case 6:
        return 'Samstag';
      default:
        return 'Unbekannt';
    }
  }

  private formatTime(value: string) {
    if (value.length === 5) {
      return `${value}:00`;
    }

    return value;
  }
}