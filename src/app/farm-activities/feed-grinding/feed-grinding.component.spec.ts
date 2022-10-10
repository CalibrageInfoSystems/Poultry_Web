import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedGrindingComponent } from './feed-grinding.component';

describe('FeedGrindingComponent', () => {
  let component: FeedGrindingComponent;
  let fixture: ComponentFixture<FeedGrindingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedGrindingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedGrindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
