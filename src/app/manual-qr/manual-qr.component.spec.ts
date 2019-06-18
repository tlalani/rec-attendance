import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualQrComponent } from './manual-qr.component';

describe('ManualQrComponent', () => {
  let component: ManualQrComponent;
  let fixture: ComponentFixture<ManualQrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualQrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
