import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedBrokersComponent } from './feed-brokers.component';

describe('FeedBrokersComponent', () => {
  let component: FeedBrokersComponent;
  let fixture: ComponentFixture<FeedBrokersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedBrokersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedBrokersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
