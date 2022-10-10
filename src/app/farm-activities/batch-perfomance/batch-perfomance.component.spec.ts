import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchPerfomanceComponent } from './batch-perfomance.component';

describe('BatchPerfomanceComponent', () => {
  let component: BatchPerfomanceComponent;
  let fixture: ComponentFixture<BatchPerfomanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchPerfomanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchPerfomanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
