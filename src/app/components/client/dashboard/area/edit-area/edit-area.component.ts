import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-area',
  imports: [],
  templateUrl: './edit-area.component.html',
  styleUrl: './edit-area.component.css'
})
export class EditAreaComponent {
  constructor(
    public dialogRef: MatDialogRef<EditAreaComponent>,  // Référence pour fermer le dialog
    @Inject(MAT_DIALOG_DATA) public data: any  // Récupérer les données passées
  ) {}

  closeDialog(): void {
    this.dialogRef.close();  // Fermer le dialog
  }
}
