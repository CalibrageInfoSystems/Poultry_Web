import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccinationreportComponent } from './vaccinationreport.component';

describe('VaccinationreportComponent', () => {
  let component: VaccinationreportComponent;
  let fixture: ComponentFixture<VaccinationreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaccinationreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccinationreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
