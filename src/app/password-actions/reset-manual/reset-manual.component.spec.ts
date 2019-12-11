import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ResetManualComponent } from "./reset-manual.component";

describe("ResetManualComponent", () => {
  let component: ResetManualComponent;
  let fixture: ComponentFixture<ResetManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResetManualComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
