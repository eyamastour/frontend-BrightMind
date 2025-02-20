import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../core/services/UserService';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="reset-container">
      <div class="reset-box">
        <div *ngIf="loading" class="loading">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Validating reset token...</p>
        </div>

        <div *ngIf="!loading && errorMessage" class="error">
          <h2>Error</h2>
          <p>{{ errorMessage }}</p>
          <button mat-raised-button color="primary" (click)="backToLogin()">
            Back to Login
          </button>
        </div>

        <div *ngIf="!loading && !errorMessage">
          <h2>Reset Your Password</h2>
          <p>Please enter your new password below.</p>
          
          <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>New Password</mat-label>
              <input 
                matInput 
                type="password" 
                formControlName="password"
                placeholder="Enter your new password">
              <mat-error *ngIf="resetForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="resetForm.get('password')?.hasError('minlength')">
                Password must be at least 6 characters long
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirm Password</mat-label>
              <input 
                matInput 
                type="password" 
                formControlName="confirmPassword"
                placeholder="Confirm your new password">
              <mat-error *ngIf="resetForm.get('confirmPassword')?.hasError('required')">
                Please confirm your password
              </mat-error>
              <mat-error *ngIf="resetForm.get('confirmPassword')?.hasError('passwordMismatch')">
                Passwords do not match
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="resetForm.invalid">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>

    <style>
      .reset-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f5f5f5;
      }

      .reset-box {
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
        width: 100%;
        margin-top: 1rem;
      }

      .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .error {
        text-align: center;
      }

      .error h2 {
        color: #e74c3c;
      }
    </style>
  `
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string = '';
  loading = true;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Get token from URL parameters
    this.route.params.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.loading = false;
        this.errorMessage = 'Reset token is missing';
        return;
      }

      // Validate token
      this.userService.validateResetToken(this.token).subscribe(
        () => {
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Invalid or expired reset token';
        }
      );
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.resetForm.valid && this.token) {
      const newPassword = this.resetForm.get('password')?.value;
      this.userService.resetPassword(this.token, newPassword).subscribe(
        (response) => {
          alert('Password has been reset successfully.');
          this.router.navigate(['/auth/login']);
        },
        (error: any) => {
          alert('Error: ' + (error.error?.message || error.message || 'An error occurred'));
        }
      );
    }
  }

  backToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
