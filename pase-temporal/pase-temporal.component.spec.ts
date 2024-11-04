import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaseTemporalComponent } from './pase-temporal.component';

describe('PaseTemporalComponent', () => {
  let component: PaseTemporalComponent;
  let fixture: ComponentFixture<PaseTemporalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaseTemporalComponent]
    });
    fixture = TestBed.createComponent(PaseTemporalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
