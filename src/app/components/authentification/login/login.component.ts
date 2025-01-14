import { AuthentificationImports } from '../authentification-imports';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Component } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthentificationConstant } from '../authentification.constants';
import { SignupComponent } from "../signup/signup.component";
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthentificationImports, FormsModule, ReactiveFormsModule, SignupComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], 
})
export class LoginComponent {
  signInForm: FormGroup;
  showSpinner: boolean = false;
  isSignDivVisiable: boolean = false;
  authConstant = AuthentificationConstant;
  signUpForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService 
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSignIn() {
    if (this.signInForm.valid) {
      this.showSpinner = true;
      const { email, password, rememberMe } = this.signInForm.value;
      
      // Call the login method from AuthService
      this.authService.login(email, password, rememberMe).subscribe(
        (response) => {
          this.showSpinner = false;
          console.log('Réponse de l\'API:', response);  // Log de la réponse
          this.toastrService.success(this.authConstant.LOGIN_SUCCESS)
          // Save token based on remember me preference
          this.authService.saveToken(response.token, rememberMe);
          console.log('Token enregistré:', localStorage.getItem('token'));  // Vérifie si le token est bien enregistré
          // Redirection vers le dashboard
          this.router.navigate(['/client/dashboard']);
                },
        (error) => {
          this.showSpinner = false;
          console.log('Erreur lors de la connexion:', error);  // Log de l'erreur
          this.toastrService.error('Invalid credentials, please try again.');
        }
      );
    } else {
      this.toastrService.warning('Please fill in the required fields correctly.');
    }
  }
}
