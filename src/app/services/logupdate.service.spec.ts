import { TestBed } from '@angular/core/testing';

import { LogupdateService } from './logupdate.service';

describe('LogupdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LogupdateService = TestBed.get(LogupdateService);
    expect(service).toBeTruthy();
  });
});
