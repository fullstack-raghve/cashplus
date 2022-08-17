import { TestBed } from '@angular/core/testing';

import { ProfileControllerService } from './profile-controller.service';

describe('ProfileControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfileControllerService = TestBed.get(ProfileControllerService);
    expect(service).toBeTruthy();
  });
});
