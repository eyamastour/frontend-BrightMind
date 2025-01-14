import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RoomService } from '../../../../../core/services/room.service';

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent {
  room = {
    name: '',
    description: '',
    installation: '',
    devices: [] as string[]
  };

  constructor(
    private dialogRef: MatDialogRef<AddRoomComponent>,
    private roomService: RoomService
  ) {
    // Get the current installation ID
    const installationId = this.roomService.getInstallationId();
    if (installationId) {
      this.room.installation = installationId;
    }
  }

  onSubmit() {
    if (this.room.name.trim()) {
      this.roomService.addRoom(this.room).subscribe({
        next: (result) => {
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error adding room:', error);
          // You might want to show an error message to the user here
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
