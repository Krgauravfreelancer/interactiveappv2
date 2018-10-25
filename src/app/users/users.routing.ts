import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';


export const UsersRoutes: Routes = [{
      path: 'userManagement',
      children: [{
        path: '',
        component: UsersComponent
    }]
}];