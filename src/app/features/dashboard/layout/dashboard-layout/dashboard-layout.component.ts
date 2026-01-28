import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {

  public authService = inject(AuthService);

  // Señal para controlar el menú móvil
  public isSidebarOpen = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update(prev => !prev);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }

  onLogout() {
    this.authService.logout();
  }
}
