import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserListTableComponent } from './admin-user-list-table.component';

describe('AdminUserListTableComponent', () => {
  let component: AdminUserListTableComponent;
  let fixture: ComponentFixture<AdminUserListTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUserListTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
