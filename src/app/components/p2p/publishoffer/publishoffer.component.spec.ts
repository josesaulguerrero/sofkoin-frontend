import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishofferComponent } from './publishoffer.component';

describe('PublishofferComponent', () => {
  let component: PublishofferComponent;
  let fixture: ComponentFixture<PublishofferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublishofferComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublishofferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
