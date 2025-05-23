import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../../../core/services/UserService';
import { AuthentificationConstant } from '../authentification.constants';
import { AuthentificationImports } from "../authentification-imports";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatCard, MatCardHeader, MatCardModule } from "@angular/material/card";
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import intlTelInput from 'intl-tel-input';
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';
import { first } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  imports: [
    FormsModule, ReactiveFormsModule, MatCard, MatCardHeader, MatIconModule, MatCardModule,
    MatSelectModule, AuthentificationImports
  ],
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  @ViewChild('phoneInput') phoneInput!: ElementRef;

  initialCountry: any;
  signupForm: FormGroup;
  authConstant = AuthentificationConstant;

  languages = [
    { value: 'francais', viewValue: 'francais' },
    { value: 'anglais', viewValue: 'anglais' },
    { value: 'italien', viewValue: 'italien' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastrService: ToastrService
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      company: ['', Validators.required],
      tel: ['', [
        Validators.required,
        Validators.pattern('^\\s*(?:\\+?(\\d{1,3}))?[-. (]*(\\d{3})[-. )]*(\\d{3})[-. ]*(\\d{4})(?: *x(\\d+))?\\s*$')
      ]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      language: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.initializePhoneInput();
  }

  onSignup(): void {
    if (this.signupForm.invalid) {
      return;
    }

    const signupData = this.signupForm.value;
    signupData.tel = this.formatPhoneNumber(); // Format phone number

    this.userService.signup(signupData).subscribe(
      (response) => {
        if (response.status === 'SUCCESS') {
          this.toastrService.success('Registration successful! Please check your email to verify your account.');
          this.router.navigate(['/auth/login']);
        }
      },
      (error) => {
        this.toastrService.error('Registration failed: ' + error.message);
      }
    );
  }

  private initializePhoneInput(): void {
    if (this.phoneInput?.nativeElement) {
      this.initialCountry = intlTelInput(this.phoneInput.nativeElement, {
        initialCountry: 'it',
        separateDialCode: true,
        dropdownContainer: document.body,
        // Add additional options to ensure dropdown is visible
        autoPlaceholder: "aggressive"
      });
      
      // Add a small delay to ensure the dropdown is properly styled
      setTimeout(() => {
        const dropdownElements = document.querySelectorAll('.iti__country-list, .iti__country');
        dropdownElements.forEach(el => {
          (el as HTMLElement).style.backgroundColor = 'white';
          (el as HTMLElement).style.opacity = '1';
        });
      }, 500);
    }
  }

  private formatPhoneNumber(): string {
    if (this.phoneInput?.nativeElement) {
      const phoneValue = this.phoneInput.nativeElement.value;
      return phoneValue;
    }
    return '';
  }

  getCountryCode() {
    if (this.initialCountry) {
      const countryData = this.initialCountry.getSelectedCountryData();
      return countryData;
    }
    return null;
  }
}
