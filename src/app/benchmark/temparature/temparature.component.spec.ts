import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemparatureComponent } from './temparature.component';

describe('TemparatureComponent', () => {
  let component: TemparatureComponent;
  let fixture: ComponentFixture<TemparatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemparatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemparatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
