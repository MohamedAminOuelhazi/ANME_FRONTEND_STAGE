import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerPvComponent } from './creer-pv.component';

describe('CreerPvComponent', () => {
  let component: CreerPvComponent;
  let fixture: ComponentFixture<CreerPvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreerPvComponent]
    });
    fixture = TestBed.createComponent(CreerPvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
