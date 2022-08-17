import { TestBed } from '@angular/core/testing';

import { OriginDestinationService } from './origin-destination.service';

describe('OriginDestinationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OriginDestinationService = TestBed.get(OriginDestinationService);
    expect(service).toBeTruthy();
  });
});
