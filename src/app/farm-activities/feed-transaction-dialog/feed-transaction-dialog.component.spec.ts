import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedTransactionDialogComponent } from './feed-transaction-dialog.component';

describe('FeedTransactionDialogComponent', () => {
  let component: FeedTransactionDialogComponent;
  let fixture: ComponentFixture<FeedTransactionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedTransactionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedTransactionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
