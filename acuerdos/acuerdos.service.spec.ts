import { TestBed } from '@angular/core/testing';

import { AcuerdosService } from './acuerdos.service';

describe('AcuerdosService', () => {
  let service: AcuerdosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcuerdosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
