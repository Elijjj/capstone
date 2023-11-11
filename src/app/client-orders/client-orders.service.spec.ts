import { TestBed } from '@angular/core/testing';

import { ClientOrdersService } from './client-orders.service';

describe('ClientOrdersService', () => {
  let service: ClientOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientOrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
