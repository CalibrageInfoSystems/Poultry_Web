import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HatcheriesComponent } from './hatcheries.component';

describe('HatcheriesComponent', () => {
  let component: HatcheriesComponent;
  let fixture: ComponentFixture<HatcheriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HatcheriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HatcheriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
