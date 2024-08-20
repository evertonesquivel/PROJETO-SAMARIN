import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-perfil-popup',
  templateUrl: './perfil-popup.component.html',
  styleUrls: ['./perfil-popup.component.css'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('openPopup', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        animate('0.3s ease-in-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate('0.3s ease-in-out', style({ opacity: 0, transform: 'scale(0.5)' })),
      ]),
    ]),
  ],
  host: {
    class: 'mat-dialog-container'
  }
})
export class PerfilPopupComponent {
  user: any;

  constructor(
    public dialogRef: MatDialogRef<PerfilPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = data.user;
  }

  closePopup(): void {
    this.dialogRef.close();
  }
}