import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InwordRegisterComponent } from './inword-register.component';

describe('InwordRegisterComponent', () => {
  let component: InwordRegisterComponent;
  let fixture: ComponentFixture<InwordRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InwordRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InwordRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
