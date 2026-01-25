import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  errorMessage = '';

  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.getRawValue();

      this.userService.login(username, password).subscribe({
        next: (user) => {
          console.log('Login exitoso:', user);
          // Por ahora guardamos algo simple, luego usaremos JWT
          localStorage.setItem('user', JSON.stringify(user));
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.errorMessage = 'Usuario o contraseña incorrectos. Intenta de nuevo.';
        }
      });
    }
  }
}
