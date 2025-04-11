import { TestBed } from '@angular/core/testing';

import { LecturaCubetaService } from './lectura-cubeta.service';

describe('LecturaCubetaService', () => {
  let service: LecturaCubetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LecturaCubetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
