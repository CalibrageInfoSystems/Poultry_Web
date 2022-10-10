import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChickShedComponent } from './chick-shed.component';

describe('ChickShedComponent', () => {
  let component: ChickShedComponent;
  let fixture: ComponentFixture<ChickShedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChickShedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChickShedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
