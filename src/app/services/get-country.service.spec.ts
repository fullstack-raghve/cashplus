import { TestBed } from '@angular/core/testing';

import { GetCountryService } from './get-country.service';

describe('GetCountryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetCountryService = TestBed.get(GetCountryService);
    expect(service).toBeTruthy();
  });
});
