import { Routes } from '@angular/router';
import { UserFormComponent } from './user/add-user';
import { AreaComponent } from './area/area.component';
import { RegionComponent } from './region/region.component';
import { BankComponent } from './bank/bank.component';
import { AreaFormComponent } from './area-form/area-form.component';
import { RegionFormComponent } from './region-form/region-form.component';
import { BankFormComponent } from './bank-form/bank-form.component';
import { Access } from './auth/access';
import { authGuard } from './auth/auth.guard';
import { UserListComponent } from './user/user-list';

export default [
    { path: 'user-list', component: UserListComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },
    { path: 'user-form', component: UserFormComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },
    { path: 'area-form', component: AreaFormComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'AREA'] } },
    { path: 'region-form', component: RegionFormComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'REGION'] } },
    { path: 'bank-form', component: BankFormComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },
    { path: 'app-area', component: AreaComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'AREA'] } },
    { path: 'app-region', component: RegionComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'REGION'] } },
    { path: 'app-bank', component: BankComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'BANK'] } },
    { path: 'edit/:id', component: UserFormComponent, data: { roles: ['ADMIN'] } },
    { path: 'edit/area/:id', component: AreaFormComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },
    { path: 'edit/region/:id', component: RegionFormComponent, canActivate: [authGuard], data: { roles: ['ADMIN', 'REGION'] } },
    { path: 'edit/bank/:id', component: BankFormComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } },
    { path: 'app-access', component: Access },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
