import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilPopupComponent } from './perfil-popup.component';

describe('PerfilPopupComponent', () => {
  let component: PerfilPopupComponent;
  let fixture: ComponentFixture<PerfilPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerfilPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
