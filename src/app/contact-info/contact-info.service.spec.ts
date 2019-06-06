import { TestBed } from '@angular/core/testing';

import { ContactInfoService } from './contact-info.service';

describe('ContactInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContactInfoService = TestBed.get(ContactInfoService);
    expect(service).toBeTruthy();
  });
});
