import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmActivitiesComponent } from './farm-activities.component';

describe('FarmActivitiesComponent', () => {
  let component: FarmActivitiesComponent;
  let fixture: ComponentFixture<FarmActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
