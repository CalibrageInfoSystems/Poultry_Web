import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowerShedComponent } from './grower-shed.component';

describe('GrowerShedComponent', () => {
  let component: GrowerShedComponent;
  let fixture: ComponentFixture<GrowerShedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrowerShedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowerShedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
