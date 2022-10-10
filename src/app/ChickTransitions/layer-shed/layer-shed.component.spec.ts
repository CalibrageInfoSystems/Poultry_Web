import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerShedComponent } from './layer-shed.component';

describe('LayerShedComponent', () => {
  let component: LayerShedComponent;
  let fixture: ComponentFixture<LayerShedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerShedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerShedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
