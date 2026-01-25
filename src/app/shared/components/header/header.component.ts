import { Component, inject } from "@angular/core";
import { UserService } from "../../services/user.service";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="bg-indigo-700 text-white shadow-md">
      <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold tracking-tighter italic">UAEM TRAIL 🏔️</h1>

        <div class="space-x-6 font-medium flex items-center">
          @if (userService.currentUser()) {
            <a routerLink="/dashboard" routerLinkActive="text-indigo-200">Dashboard</a>
            <span class="text-indigo-300 text-sm">| Bienvenido {{ userService.currentUser()?.username }}</span>
            <button (click)="onLogout()" class="bg-indigo-800 hover:bg-red-600 px-3 py-1 rounded-lg transition-all text-sm">
              Salir
            </button>
          } @else {
            <a routerLink="/auth/login" routerLinkActive="text-indigo-200">Login</a>
            <a routerLink="/auth/register" routerLinkActive="text-indigo-200">Registro</a>
          }
        </div>
      </div>
    </nav>
  `
})
export class HeaderComponent {
  userService = inject(UserService);

  onLogout() {
    // if (confirm('¿Cerrar sesión?')) {
    this.userService.logout();
    // }
  }
}
