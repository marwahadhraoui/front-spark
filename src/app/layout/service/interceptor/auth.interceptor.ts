import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from '../keycloak/keycloak.service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
     const kcService = inject(KeycloakService);
      const token = kcService.Keycloak.token;

 if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req); 
};
   


