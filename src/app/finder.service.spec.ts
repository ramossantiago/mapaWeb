import { TestBed, inject } from '@angular/core/testing';

import { FinderService } from './finder.service';

describe('FinderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinderService]
    });
  });

  it('should be created', inject([FinderService], (service: FinderService) => {
    expect(service).toBeTruthy();
  }));
});
