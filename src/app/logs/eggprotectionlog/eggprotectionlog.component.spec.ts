import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EggprotectionlogComponent } from './eggprotectionlog.component';

describe('EggprotectionlogComponent', () => {
  let component: EggprotectionlogComponent;
  let fixture: ComponentFixture<EggprotectionlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EggprotectionlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EggprotectionlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
