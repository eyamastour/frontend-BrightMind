import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/UserService';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="forgot-container">
      <div class="forgot-box">
        <h2>Reset Password</h2>
        <p>Enter your email address and we'll send you a link to reset your password.</p>
        
        <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="Enter your email">
            <mat-error *ngIf="forgotForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="forgotForm.get('email')?.hasError('email')">
              Please enter a valid email address
            </mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="forgotForm.invalid">
            Send Reset Link
          </button>

          <button mat-button type="button" (click)="backToLogin()">
            Back to Login
          </button>
        </form>
      </div>
    </div>

    <style>
      .forgot-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f5f5f5;
      }

      .forgot-box {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        width: 100%;
        max-width: 400px;
        text-align: center;
      }

      h2 {
        color: #2c3e50;
        margin-bottom: 1rem;
      }

      p {
        color: #7f8c8d;
        margin-bottom: 2rem;
      }

      .full-width {
        width: 100%;
        margin-bottom: 1rem;
      }

      button {
        margin: 0.5rem;
        width: 100%;
      }

      button[type="button"] {
        margin-top: 1rem;
      }
    </style>
  `
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      const email = this.forgotForm.get('email')?.value;
      this.userService.forgotPassword(email).subscribe(
        (response) => {
          alert('Password reset link has been sent to your email.');
          this.router.navigate(['/auth/login']);
        },
        (error) => {
          alert('Error: ' + error.message);
        }
      );
    }
  }

  backToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
