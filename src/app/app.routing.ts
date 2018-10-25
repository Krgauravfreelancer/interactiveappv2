import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AuthGuard } from './services/auth.guard';
import { AdminGuard } from './services/admin.guard';
import { LivefeedComponent } from './livefeed/livefeed/livefeed.component';
import { LivefeedsearchComponent } from './livefeed/livefeedsearch/livefeedsearch.component';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'users',
        loadChildren: './users/users.module#UsersModule',
        canActivate: [AdminGuard]
      },
      {
        path: '',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'feed',
        loadChildren: './feed/feed.module#FeedModule'
      },
      { path: 'livefeed', component: LivefeedComponent },
      { path: 'livefeedsearch', component: LivefeedsearchComponent },
    ],
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [{
      path: '',
      loadChildren: './pages/pages.module#PagesModule'
    }]
  }
];
