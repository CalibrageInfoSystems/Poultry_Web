import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionanalysisComponent } from './productionanalysis.component';

describe('ProductionanalysisComponent', () => {
  let component: ProductionanalysisComponent;
  let fixture: ComponentFixture<ProductionanalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionanalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
