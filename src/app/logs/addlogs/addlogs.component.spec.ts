import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddlogsComponent } from './addlogs.component';

describe('AddlogsComponent', () => {
  let component: AddlogsComponent;
  let fixture: ComponentFixture<AddlogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddlogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
