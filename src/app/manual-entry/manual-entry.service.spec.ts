import { TestBed } from '@angular/core/testing';

import { ManualEntryService } from './manual-entry.service';

describe('ManualEntryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManualEntryService = TestBed.get(ManualEntryService);
    expect(service).toBeTruthy();
  });
});
