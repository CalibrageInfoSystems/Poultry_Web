import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedpurchasereportComponent } from './feedpurchasereport.component';

describe('FeedpurchasereportComponent', () => {
  let component: FeedpurchasereportComponent;
  let fixture: ComponentFixture<FeedpurchasereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedpurchasereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedpurchasereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
