import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTransactionsDialogComponent } from './view-transactions-dialog.component';

describe('ViewTransactionsDialogComponent', () => {
  let component: ViewTransactionsDialogComponent;
  let fixture: ComponentFixture<ViewTransactionsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTransactionsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTransactionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
