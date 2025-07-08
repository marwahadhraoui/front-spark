import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from '../../layout/service/keycloak/keycloak.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const keycloakService = inject(KeycloakService);
  const allowedRoles = route.data?.['roles'] as string[] | undefined;
  const storedRoles = keycloakService.Roles || '[]';

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = allowedRoles.some(role => storedRoles.includes(role));
    if (!hasAccess) {
      router.navigate(['app-access']);
      return false;
    }
  }

  return true;
};