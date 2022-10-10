import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedDueReportComponent } from './feed-due-report.component';

describe('FeedDueReportComponent', () => {
  let component: FeedDueReportComponent;
  let fixture: ComponentFixture<FeedDueReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedDueReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedDueReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
