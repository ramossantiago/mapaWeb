import { TestBed, inject } from '@angular/core/testing';

import { PosicionService } from './posicion.service';

describe('PosicionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PosicionService]
    });
  });

  it('should be created', inject([PosicionService], (service: PosicionService) => {
    expect(service).toBeTruthy();
  }));
});
