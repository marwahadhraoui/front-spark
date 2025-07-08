import { Routes } from '@angular/router';
import { UserListComponent } from '../user/user-list';
import { AreaComponent } from '../area/area.component';
import { RegionComponent } from '../region/region.component';

export default [
  
    { path: 'user-list', data: { breadcrumb: 'Table' }, component: UserListComponent },
    { path: 'app-area', data: { breadcrumb: 'Table' }, component: AreaComponent },
    { path: 'app-region', data: { breadcrumb: 'Table' }, component: RegionComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
