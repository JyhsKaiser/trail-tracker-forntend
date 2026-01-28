import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { UserService } from '../../../user/services/user.service';
import { RouterLink } from '@angular/router';
import { FooterComponent } from "../../../../shared/components/footter/footer.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, FooterComponent],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private userService = inject(UserService);

  message = '';

  registerForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
  });

  onRegister() {
    if (this.registerForm.valid) {
      this.userService.register(this.registerForm.getRawValue()).subscribe({
        next: () => {
          this.message = '¡Registro exitoso! Ya puedes iniciar sesión.';
          this.registerForm.reset();
        },
        error: () => this.message = 'Error: El usuario ya existe o los datos son inválidos.'
      });
    }
  }
}
