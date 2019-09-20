import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecOptionsDialogComponent } from './rec-options-dialog.component';

describe('RecOptionsDialogComponent', () => {
  let component: RecOptionsDialogComponent;
  let fixture: ComponentFixture<RecOptionsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecOptionsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecOptionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
