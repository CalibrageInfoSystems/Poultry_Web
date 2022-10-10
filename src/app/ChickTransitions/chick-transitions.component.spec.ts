import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChickTransitionsComponent } from './chick-transitions.component';

describe('ChickTransitionsComponent', () => {
  let component: ChickTransitionsComponent;
  let fixture: ComponentFixture<ChickTransitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChickTransitionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChickTransitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
