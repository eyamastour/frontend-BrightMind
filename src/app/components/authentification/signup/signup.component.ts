import { Component } from '@angular/core';
import { UserService } from '../../../core/services/UserService';
import { AuthentificationConstant } from '../authentification.constants';
import { AuthentificationImports } from "../authentification-imports";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatCard, MatCardHeader, MatCardModule } from "@angular/material/card";
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  imports: [
    FormsModule, ReactiveFormsModule, MatCard, MatCardHeader, MatIconModule,MatCardModule,
    MatSelectModule, AuthentificationImports
  ],
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  languages = [
    { value: 'francais', viewValue: 'francais' },
    { value: 'anglais', viewValue: 'anglais' },
    { value: 'italien', viewValue: 'italien' }
  ];
  
  signupForm: FormGroup;
  authConstant = AuthentificationConstant;
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      company: ['', Validators.required],
      tel: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Validation pour le numéro de téléphone
      language: ['', Validators.required],
    });
  
  }

  onSignup(): void {
    if (this.signupForm.invalid) {
      return;
    }
  
    const signupData = this.signupForm.value;
    console.log('Données envoyées:', signupData); // Vérifiez ici
  
    this.userService.signup(signupData).subscribe(
      (response) => {
        if (response.status === 'SUCCESS') {
          alert('Signup successful! Please verify your email.');
          this.router.navigate(['/auth/login']);
        }
      },
      (error) => {
        alert('Signup failed: ' + error.message);
      }
    );
  }
  
  
}
