import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveoffersComponent } from './activeoffers.component';

describe('ActiveoffersComponent', () => {
  let component: ActiveoffersComponent;
  let fixture: ComponentFixture<ActiveoffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveoffersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveoffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
