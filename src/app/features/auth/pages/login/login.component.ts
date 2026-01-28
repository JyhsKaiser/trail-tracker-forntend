import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { FooterComponent } from "../../../../shared/components/footter/footer.component";

@Component({
  selector: 'app-login',
  standalone: true,
  // En Angular 21, al usar el nuevo Control Flow (@if), ya no necesitas CommonModule
  imports: [ReactiveFormsModule, RouterLink, FooterComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);



  // Usamos una signal para el mensaje de error, manteniendo la reactividad moderna
  message = signal('');

  loginForm = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  onLogin() {
    if (this.loginForm.invalid) return;

    // Obtenemos los valores limpios del formulario
    const credentials = this.loginForm.getRawValue();

    this.authService.login(credentials).subscribe({
      next: (user) => {
        // console.log('Login exitoso:', user);

        /** * Al usar la arquitectura que definimos:
         * 1. El AuthService actualiza su Signal interna 'currentUser'.
         * 2. El interceptor ya está listo para adjuntar el JWT en futuras peticiones.
         */
        this.router.navigate(['/dashboard/analytics']);
      },
      error: (err) => {
        // Manejo de error dinámico basado en la respuesta del back
        this.message.set(err.error?.message || 'Usuario o contraseña incorrectos.');
      }
    });
  }
}
