import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../services/user.service';
import { FooterComponent } from "../../../../shared/components/footter/footer.component";


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private userService = inject(UserService);
  // Estado para alternar entre vista y edición
  public isEditing = signal(false);

  public profileForm: FormGroup = this.fb.group({
    email: [this.authService.currentUser()?.email, [Validators.required, Validators.email]],
    // Podrías agregar campos adicionales como 'dependency' o 'role'
  });

  public passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(1)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  // Validador personalizado
  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  toggleEdit() {
    this.isEditing.update(v => !v);
    if (!this.isEditing()) this.profileForm.reset(this.authService.currentUser());
  }

  saveProfile() {
    if (this.profileForm.invalid) return;

    // Solo enviamos los campos del formulario (username y email)
    const updatedData = this.profileForm.value;

    this.userService.updateProfile(updatedData).subscribe({
      next: () => {
        console.log('✅ Perfil actualizado en BD y Signal');
        this.isEditing.set(false);
        // Opcional: Una notificación de éxito
        alert('Datos actualizados correctamente');
      },
      error: (err) => {
        console.error('❌ Error al actualizar perfil:', err);
        // Aquí el interceptor de errores ya debería estar haciendo su trabajo
      }
    });
  }

  onChangePassword() {
    if (this.passwordForm.invalid) return;

    const data = {
      oldPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
    };

    this.userService.changePassword(data).subscribe({
      next: () => {
        alert('Contraseña actualizada correctamente');
        this.passwordForm.reset();
      },
      error: (err) => alert(err.error?.message || 'Error al cambiar contraseña')
    });
  }
}
