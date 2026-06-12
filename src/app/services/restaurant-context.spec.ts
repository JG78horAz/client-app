import { TestBed } from '@angular/core/testing';

import { RestaurantContext } from './restaurant-context';

describe('RestaurantContext', () => {
  let service: RestaurantContext;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurantContext);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
