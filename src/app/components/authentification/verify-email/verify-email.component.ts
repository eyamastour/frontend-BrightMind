import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="verify-container">
      <div class="verify-box">
        <h2>Email Verification Successful!</h2>
        <p>Your email has been successfully verified.</p>
        <button (click)="goToLogin()" class="login-btn">Go to Login</button>
      </div>
    </div>
    <style>
      .verify-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f5f5f5;
      }
      .verify-box {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
      .login-btn {
        background-color: #3498db;
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s;
      }
      .login-btn:hover {
        background-color: #2980b9;
      }
    </style>
  `,
})
export class VerifyEmailComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
