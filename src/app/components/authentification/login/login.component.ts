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
  }

  onSignIn() {
    if (this.signInForm.valid) {
      this.showSpinner = true;
      const { email, password, rememberMe } = this.signInForm.value;
  
      this.authService.login(email, password, rememberMe).subscribe(
        (response) => {
          this.showSpinner = false;
          this.toastrService.success(this.authConstant.LOGIN_SUCCESS);
          
          // La sauvegarde du token et de l'utilisateur est déjà gérée dans le service auth
          const user = this.authService.getCurrentUser();
          console.log('Connexion réussie:', { user });
  
          this.router.navigate(['/client/dashboard']);
        },
        (error) => {
          this.showSpinner = false;
          console.error('Erreur lors de la connexion:', error);
          this.toastrService.error('Invalid credentials, please try again.');
        }
      );
    } else {
      this.toastrService.warning('Please fill in the required fields correctly.');
    }
  }
}
