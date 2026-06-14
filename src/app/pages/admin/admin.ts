import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
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

interface MenuCategoryDraft {
  name: string;
  items: MenuItemDraft[];
}

interface MenuItemDraft {
  name: string;
  description: string;
  price: number;
}

@Component({
  selector: 'app-admin',
  imports: [FormsModule, DecimalPipe],
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
  menuMessage = signal('');

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

  menuCategories = signal<MenuCategoryDraft[]>([]);
  newCategoryName = '';

  selectedCategoryIndex = 0;
  newItemName = '';
  newItemDescription = '';
  newItemPrice = 0;

  registerRestaurant() {
    this.errorMessage.set('');
    this.response.set(undefined);
    this.openingTimesMessage.set('');
    this.menuMessage.set('');

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
        this.saveMenu();
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

  addCategory() {
    if (!this.newCategoryName.trim()) {
      this.menuMessage.set('Bitte Kategorienamen eingeben.');
      return;
    }

    this.menuCategories.update(categories => [
      ...categories,
      {
        name: this.newCategoryName.trim(),
        items: [],
      },
    ]);

    this.newCategoryName = '';
    this.menuMessage.set('');

    if (this.restaurantContextService.hasContext()) {
      this.saveMenu();
    }
  }

  removeCategory(index: number) {
    this.menuCategories.update(categories =>
      categories.filter((_, currentIndex) => currentIndex !== index)
    );

    if (this.selectedCategoryIndex >= this.menuCategories().length) {
      this.selectedCategoryIndex = 0;
    }

    if (this.restaurantContextService.hasContext()) {
      this.saveMenu();
    }
  }

  addMenuItem() {
    const categories = this.menuCategories();

    if (categories.length === 0) {
      this.menuMessage.set('Bitte zuerst eine Kategorie anlegen.');
      return;
    }

    if (!this.newItemName.trim()) {
      this.menuMessage.set('Bitte Speisename eingeben.');
      return;
    }

    if (this.newItemPrice <= 0) {
      this.menuMessage.set('Der Preis muss größer als 0 sein.');
      return;
    }

    this.menuCategories.update(currentCategories =>
      currentCategories.map((category, index) => {
        if (index !== this.selectedCategoryIndex) {
          return category;
        }

        return {
          ...category,
          items: [
            ...category.items,
            {
              name: this.newItemName.trim(),
              description: this.newItemDescription.trim(),
              price: this.newItemPrice,
            },
          ],
        };
      })
    );

    this.newItemName = '';
    this.newItemDescription = '';
    this.newItemPrice = 0;
    this.menuMessage.set('');

    if (this.restaurantContextService.hasContext()) {
      this.saveMenu();
    }
  }

  removeMenuItem(categoryIndex: number, itemIndex: number) {
    this.menuCategories.update(categories =>
      categories.map((category, index) => {
        if (index !== categoryIndex) {
          return category;
        }

        return {
          ...category,
          items: category.items.filter(
            (_, currentIndex) => currentIndex !== itemIndex
          ),
        };
      })
    );

    if (this.restaurantContextService.hasContext()) {
      this.saveMenu();
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

  private saveMenu() {
    const restaurantId = this.restaurantContextService.getRestaurantId();
    const apiKey = this.restaurantContextService.getApiKey();

    if (restaurantId === undefined || apiKey === undefined) {
      this.menuMessage.set('Bitte zuerst ein Restaurant registrieren.');
      return;
    }

    const request = {
      categories: this.menuCategories().map((category, categoryIndex) => ({
        name: category.name,
        sortOrder: categoryIndex + 1,
        items: category.items.map((item, itemIndex) => ({
          name: item.name,
          description: item.description || undefined,
          price: item.price,
          sortOrder: itemIndex + 1,
        })),
      })),
    };

    this.restaurantService.updateMenu(restaurantId, apiKey, request).subscribe({
      next: () => {
        this.menuMessage.set('Speisekarte wurde gespeichert.');
      },
      error: () => {
        this.menuMessage.set('Speisekarte konnte nicht gespeichert werden.');
      },
    });
  }

  hasOpeningTimeForDay(dayOfWeek: number) {
    return this.openingTimes().some(
      openingTime => openingTime.dayOfWeek === dayOfWeek
    );
  }

  private formatTime(value: string) {
    if (value.length === 5) {
      return `${value}:00`;
    }

    return value;
  }
}