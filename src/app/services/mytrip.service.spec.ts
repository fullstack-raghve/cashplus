import { TestBed } from '@angular/core/testing';

import { MytripService } from './mytrip.service';

describe('MytripService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MytripService = TestBed.get(MytripService);
    expect(service).toBeTruthy();
  });
});
