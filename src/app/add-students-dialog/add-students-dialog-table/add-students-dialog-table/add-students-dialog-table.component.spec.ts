import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudentsDialogTableComponent } from './add-students-dialog-table.component';

describe('AddStudentsDialogTableComponent', () => {
  let component: AddStudentsDialogTableComponent;
  let fixture: ComponentFixture<AddStudentsDialogTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStudentsDialogTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStudentsDialogTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
