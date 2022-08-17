import { TestBed } from '@angular/core/testing';

import { ScrollPaginationService } from './scroll-pagination.service';

describe('ScrollPaginationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScrollPaginationService = TestBed.get(ScrollPaginationService);
    expect(service).toBeTruthy();
  });
});
