import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedPurchaseComponent } from './feed-purchase.component';

describe('FeedPurchaseComponent', () => {
  let component: FeedPurchaseComponent;
  let fixture: ComponentFixture<FeedPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
