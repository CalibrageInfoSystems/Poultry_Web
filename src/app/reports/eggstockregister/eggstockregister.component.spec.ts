import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EggstockregisterComponent } from './eggstockregister.component';

describe('EggstockregisterComponent', () => {
  let component: EggstockregisterComponent;
  let fixture: ComponentFixture<EggstockregisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EggstockregisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EggstockregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
