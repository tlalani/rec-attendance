import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetForgotComponent } from './reset-forgot.component';

describe('ResetForgotComponent', () => {
  let component: ResetForgotComponent;
  let fixture: ComponentFixture<ResetForgotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetForgotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetForgotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
