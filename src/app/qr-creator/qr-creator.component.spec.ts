import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCreatorComponent } from './qr-creator.component';

describe('QrCreatorComponent', () => {
  let component: QrCreatorComponent;
  let fixture: ComponentFixture<QrCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
