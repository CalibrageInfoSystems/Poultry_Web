import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CullingBirdsComponent } from './culling-birds.component';

describe('CullingBirdsComponent', () => {
  let component: CullingBirdsComponent;
  let fixture: ComponentFixture<CullingBirdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CullingBirdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CullingBirdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
