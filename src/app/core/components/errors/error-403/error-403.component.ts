import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-error-403',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './error-403.component.html',
  styles: []
})
export class Error403Component implements OnInit {
  private router = inject(Router);
  // private authService = inject(AuthService); // Inyecta tu servicio de seguridad

  ngOnInit(): void {
    // Redirección automática opcional tras 10 segundos
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 10000);
  }

  logout(): void {
    // Lógica para limpiar el JWT y XSRF token
    // this.authService.logout();
    this.router.navigate(['/login']);
  }
}
