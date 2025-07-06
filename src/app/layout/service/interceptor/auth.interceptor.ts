import {HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
   


