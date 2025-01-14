import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoomService } from '../../../../../core/services/room.service';
import { Room } from '../../../../../core/models/room.model';

@Component({
  selector: 'app-edit-room',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.css']
})
export class EditRoomComponent {
  room: Room;

  constructor(
    private dialogRef: MatDialogRef<EditRoomComponent>,
    private roomService: RoomService,
    @Inject(MAT_DIALOG_DATA) data: { room: Room }
  ) {
    this.room = { ...data.room }; // Create a copy of the room data
  }

  onSubmit() {
    if (this.room.name.trim() && this.room._id) {
      this.roomService.updateRoom(this.room._id, this.room).subscribe({
        next: (result) => {
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error updating room:', error);
          // You might want to show an error message to the user here
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
