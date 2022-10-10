import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDailyLogsComponent } from './add-daily-logs.component';

describe('AddDailyLogsComponent', () => {
  let component: AddDailyLogsComponent;
  let fixture: ComponentFixture<AddDailyLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDailyLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDailyLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
