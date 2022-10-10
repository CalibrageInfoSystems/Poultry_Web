import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeexpensesreportComponent } from './incomeexpensesreport.component';

describe('IncomeexpensesreportComponent', () => {
  let component: IncomeexpensesreportComponent;
  let fixture: ComponentFixture<IncomeexpensesreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeexpensesreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeexpensesreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
