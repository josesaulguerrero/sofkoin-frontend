import { TestBed } from '@angular/core/testing';

import { BetarequestService } from './betarequest.service';

describe('BetarequestService', () => {
  let service: BetarequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BetarequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
