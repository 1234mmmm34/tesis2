import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TesoreroComponent } from './tesorero.component';

describe('TesoreroComponent', () => {
  let component: TesoreroComponent;
  let fixture: ComponentFixture<TesoreroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TesoreroComponent]
    });
    fixture = TestBed.createComponent(TesoreroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
