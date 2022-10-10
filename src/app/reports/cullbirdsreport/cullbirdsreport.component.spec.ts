import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CullbirdsreportComponent } from './cullbirdsreport.component';

describe('CullbirdsreportComponent', () => {
  let component: CullbirdsreportComponent;
  let fixture: ComponentFixture<CullbirdsreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CullbirdsreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CullbirdsreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
