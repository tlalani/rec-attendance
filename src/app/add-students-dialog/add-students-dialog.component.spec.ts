import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudentsDialogComponent } from './add-students-dialog.component';

describe('AddStudentsDialogComponent', () => {
  let component: AddStudentsDialogComponent;
  let fixture: ComponentFixture<AddStudentsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStudentsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStudentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
