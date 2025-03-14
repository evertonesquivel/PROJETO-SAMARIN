import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchAnimationComponent } from './match-animation.component';

describe('MatchAnimationComponent', () => {
  let component: MatchAnimationComponent;
  let fixture: ComponentFixture<MatchAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchAnimationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatchAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
