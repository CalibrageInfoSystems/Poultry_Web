import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EggTradersComponent } from './egg-traders.component';

describe('EggTradersComponent', () => {
  let component: EggTradersComponent;
  let fixture: ComponentFixture<EggTradersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EggTradersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EggTradersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
