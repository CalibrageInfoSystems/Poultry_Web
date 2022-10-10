import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyproductionreportComponent } from './dailyproductionreport.component';

describe('DailyproductionreportComponent', () => {
  let component: DailyproductionreportComponent;
  let fixture: ComponentFixture<DailyproductionreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyproductionreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyproductionreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
