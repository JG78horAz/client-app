import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);

  await authService.init();

  if (authService.isAuthenticated()) {
    return true;
  }

  await authService.login();

  return false;
};