import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanModuleComponent } from './scan-module.component';

describe('ScanModuleComponent', () => {
  let component: ScanModuleComponent;
  let fixture: ComponentFixture<ScanModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
