import { inject, Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { User } from '../../../../Model/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  private _keycloak: Keycloak | undefined;
  private _user: User | undefined;
  private _roles: string[] = [];
  private router = inject(Router);

  get Keycloak() {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: 'http://localhost:8080',
        realm: 'spark-realm',
        clientId: 'spark-backend'
      });
    }
    return this._keycloak;
  }

  get User(): User | undefined {
    return this._user;

  }
  get Roles(): string[] {
    return this._roles;
  }
  async init() {
    if (typeof window === 'undefined') {
      console.warn('Keycloak cannot run in a non-browser environment.');
      return;
    }
    const authenticated = await this.Keycloak?.init({
      onLoad: 'login-required'
    });

    if (authenticated) {
      this._user = (await this.Keycloak.loadUserProfile()) as User;
      this._user.token = this._keycloak?.token;
      const tokenParsed = this.Keycloak.tokenParsed;
      const realmRoles = tokenParsed?.realm_access?.roles || [];
      const clientRoles = tokenParsed?.resource_access?.['spark-backend']?.roles || [];
      this._roles = [...realmRoles, ...clientRoles];
      const currentUrl = window.location.pathname;
      if (currentUrl === '/' || currentUrl === '/landing') {
        this.redirectBasedOnRole();
      }
    }
  }

  logout() {
    return this.Keycloak.logout({ redirectUri: 'http://localhost:4200' });
  }

  profileManagement() {
    return this.Keycloak.accountManagement();
  }
  constructor() { }

   redirectBasedOnRole(): void {
    if (this._roles.includes('ADMIN')) {
      this.router.navigate(['/pages/user-list']);
    } else if (this._roles.includes('AREA')) {
      this.router.navigate(['/pages/app-area']);
    } else if (this._roles.includes('REGION')) {
      this.router.navigate(['/pages/app-region']);
    } else if (this._roles.includes('BANK')) {
      this.router.navigate(['/pages/app-bank']);
    } else {
      this.router.navigate(['app-access']);
    }
  }

}
