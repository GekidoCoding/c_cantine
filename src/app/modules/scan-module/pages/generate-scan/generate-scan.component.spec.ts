import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateScanComponent } from './generate-scan.component';

describe('GenerateScanComponent', () => {
  let component: GenerateScanComponent;
  let fixture: ComponentFixture<GenerateScanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateScanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
