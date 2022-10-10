import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EggsaleregisterComponent } from './eggsaleregister.component';

describe('EggsaleregisterComponent', () => {
  let component: EggsaleregisterComponent;
  let fixture: ComponentFixture<EggsaleregisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EggsaleregisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EggsaleregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
