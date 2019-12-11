import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetFromEmailComponent } from './reset-from-email.component';

describe('ResetFromEmailComponent', () => {
  let component: ResetFromEmailComponent;
  let fixture: ComponentFixture<ResetFromEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetFromEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetFromEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
