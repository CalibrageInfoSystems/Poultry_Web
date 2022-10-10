import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlybalancereportComponent } from './monthlybalancereport.component';

describe('MonthlybalancereportComponent', () => {
  let component: MonthlybalancereportComponent;
  let fixture: ComponentFixture<MonthlybalancereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlybalancereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlybalancereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
