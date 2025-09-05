import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionTechniqueComponent } from './commission-technique.component';

describe('CommissionTechniqueComponent', () => {
  let component: CommissionTechniqueComponent;
  let fixture: ComponentFixture<CommissionTechniqueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommissionTechniqueComponent]
    });
    fixture = TestBed.createComponent(CommissionTechniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
