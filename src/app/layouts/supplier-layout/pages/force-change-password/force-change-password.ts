import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { UserService } from '../../../../core/services/user.service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { LoaderService } from '../../../../core/services/loader.service';

@Component({
  selector: 'app-force-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, ToastModule],
  templateUrl: './force-change-password.html',
  styleUrl: './force-change-password.css',
  providers: [MessageService],
})
export class ForceChangePassword {
  form;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private storage: LocalStorageService,
    private router: Router,
    private loader: LoaderService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required],
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    if (value.newPassword !== value.confirmPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Password mismatch',
        detail: 'New password and confirm password must be same.',
      });
      return;
    }

    this.loader.show();
    this.userService.changePassword({
      oldPassword: value.oldPassword || '',
      newPassword: value.newPassword || '',
    }).subscribe({
      next: () => {
        const user = this.storage.getUser();
        this.storage.setUser({ ...user, mustChangePassword: false });
        this.loader.hide();
        this.messageService.add({
          severity: 'success',
          summary: 'Password updated',
          detail: 'You can now continue with your account.',
          life: 1500,
        });
        setTimeout(() => this.router.navigate(['/supplier/dashboard']), 700);
      },
      error: (error: HttpErrorResponse) => {
        this.loader.hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Password change failed',
          detail: error?.error?.message || error?.message || 'Please check your current password.',
          life: 4000,
        });
      },
    });
  }
}
