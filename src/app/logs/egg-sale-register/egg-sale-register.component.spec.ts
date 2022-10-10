import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EggSaleRegisterComponent } from './egg-sale-register.component';

describe('EggSaleRegisterComponent', () => {
  let component: EggSaleRegisterComponent;
  let fixture: ComponentFixture<EggSaleRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EggSaleRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EggSaleRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
