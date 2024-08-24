import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicialPageComponent } from './inicial-page.component';

describe('InicialPageComponent', () => {
  let component: InicialPageComponent;
  let fixture: ComponentFixture<InicialPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicialPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InicialPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
