import { Component, NgZone } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  nameValidator,
} from '../../shared/validators/regex.validator';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { CognitoService } from '../../shared/services/cognito.service';
import { SignUpParameters } from '../../interfaces/sing-up-parameters';
import { UsersService } from '../../shared/services/user-service/user-service';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss',
})
export class AuthenticationComponent {
  public userForm = new FormGroup({
    userUsername: new FormControl(''),
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    userPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  public verificationCode = new FormControl('', [
    Validators.required
  ]);
  public regexMessage = '';

  public isLogin = false;
  public needConfirmation = false;
  public title: 'Sign in' | 'Register' = 'Register';

  public createUserSubscription: Subscription | undefined;
  public validateUserSubscription: Subscription | undefined;

  constructor(
    private cognitoService: CognitoService,
    private router: Router,
    private location: Location,
    private ngZone: NgZone,
    private userService: UsersService
  ) {
    this.navigateToHome();
    this.initializeLogin();
  }



  navigateToHome(): void {
    if (sessionStorage.getItem('session_token')) {
      this.router.navigate(['home']);
    }
  }

  initializeLogin(): void {
    if (this.location.path() === '/login') {
      this.userForm.patchValue({ userUsername: 'loginDefault' });
      this.isLogin = true;
      this.title = 'Sign in';
    }
  }

  onUsernameChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const value = inputElement.value;
      this.userForm.patchValue({
        userUsername: value,
      });
      if (this.userForm.get('userUsername')?.errors) {
        switch (this.userForm.get('userUsername')!.errors!['pattern']) {
          case 'lenght':
            this.regexMessage = 'El nombre debe tener entre 5 y 20 carácteres!';
            break;
          case 'numbers':
            this.regexMessage = 'No debe haber más de 3 números en el nombre!';
            break;
          case 'spaces':
            this.regexMessage = 'Solo un espacio es permitido!';
            break;
          default:
            this.regexMessage = 'Solo se permiten carácteres alfanuméricos!';
            break;
        }
      } else {
        this.regexMessage = '';
      }
    }
  }

  onEmailChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const value = inputElement.value;
      this.userForm.patchValue({
        userEmail: value,
      });
      if (this.userForm.get('userEmail')?.hasError('required')) {
        this.regexMessage = 'No debes dejar ningún campo vacío!';
        return;
      }
      if (this.userForm.get('userEmail')?.hasError('email')) {
        this.regexMessage = 'Debes escribir un email válido!';
        return;
      }
      this.regexMessage = '';
    }
  }

  onPasswordChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const value = inputElement.value;
      this.userForm.patchValue({
        userPassword: value,
      });
      if (this.userForm.get('userPassword')?.hasError('required')) {
        this.regexMessage = 'No debes dejar ningún campo vacío!';
        return;
      }
      if (this.userForm.get('userPassword')?.hasError('minlength')) {
        this.regexMessage = 'La contraseña debe tener al menos 8 carácteres!';
        return;
      }
      this.regexMessage = '';
    }
  }

  onCodeChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.verificationCode.patchValue(inputElement.value);
    }
  }

  async createUser(): Promise<void> {
    const { userEmail, userPassword, userUsername } = this.userForm.value;

    if (userUsername && userEmail && userPassword ) {

        const user: SignUpParameters = {
          username: userUsername,
          nickname: userUsername,
          email: userEmail,
          password: userPassword,
        };

        const nextStep: any = await this.cognitoService.handleSignUp(user);
        
        if (nextStep?.signUpStep === 'CONFIRM_SIGN_UP') this.needConfirmation = true;
   
    }
  }

  async confirmCreatedUser(): Promise<void> {
    const { userUsername } = this.userForm.value;
    const confirmation = {
        username: userUsername ?? '',
        confirmationCode: this.verificationCode.value ?? '',
    };
    const nextStep: any = await this.cognitoService.handleSignUpConfirmation(confirmation);

    if(nextStep?.signUpStep === 'COMPLETE_AUTO_SIGN_IN') {
      const isSignedIn: any = await this.cognitoService.handleAutoSignIn();

      this.assignUserValues(isSignedIn);
    }
  }

  async logoutUser(): Promise<void> {
    try {
      await this.cognitoService.handleSignOut();
      sessionStorage.removeItem('session_token');
      sessionStorage.removeItem('user_id');
      sessionStorage.removeItem('user_username');
      
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }


  async assignUserValues(isSignedIn: boolean) {
    if(isSignedIn) {
      const token = await this.cognitoService.currentSession();
      sessionStorage.setItem('session_token', token.toString());

      const {username, userId} = await this.cognitoService.currentAuthenticatedUser();

      this.userService.setUserId(userId);
      sessionStorage.setItem('user_id', userId);

      this.userService.setUsername(username);
      sessionStorage.setItem('user_username', username);

      this.router.navigate(['home']);
    } 
}
  

  async validateUser(): Promise<void> {
    const { userEmail, userPassword } = this.userForm.value;
  
    if (userEmail && userPassword) {
      const user = {
        username: userEmail,
        password: userPassword
      };
      const signInResult = await this.cognitoService.handleSignIn(user);
  
      // Verificamos si el inicio de sesión fue exitoso
      if (signInResult.success) {
        this.assignUserValues(true); 
      } else {
        alert(signInResult.message);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.createUserSubscription) {
      this.createUserSubscription.unsubscribe();
    }
    if (this.validateUserSubscription) {
      this.validateUserSubscription.unsubscribe();
    }
  }
}