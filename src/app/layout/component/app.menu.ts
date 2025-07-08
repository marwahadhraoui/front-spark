import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { KeycloakService } from '../service/keycloak/keycloak.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];
    private keycloakService = inject(KeycloakService)
    ngOnInit() {
        const roles: string[] = this.keycloakService.Roles;
        this.model = [
            {
                label: 'Home',
                items: [
                    ...(roles.includes('ADMIN') ? [
                        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/uikit/user-list'] },
                    ] : []),

                    ...(roles.includes('ADMIN') || roles.includes('AREA') ? [
                        { label: 'Areas', icon: 'pi pi-map-marker', routerLink: ['/pages/app-area'] }
                    ] : []),

                    ...(roles.includes('ADMIN') || roles.includes('REGION') ? [
                        { label: 'Regions', icon: 'pi pi-map', routerLink: ['/pages/app-region'] }
                    ] : []),

                    ...(roles.includes('ADMIN') || roles.includes('BANK') ? [
                        { label: 'Banks', icon: 'pi pi-building-columns', routerLink: ['/pages/app-bank'] }
                    ] : [])
                ]
            },
           
        ];
    }
}
