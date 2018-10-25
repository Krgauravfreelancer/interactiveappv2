import { Routes } from '@angular/router';

import { HistoricComponent } from './historic/historic.component';
import { LiveComponent } from './live/live.component';

export const FeedRoutes: Routes = [{
    path: '',
    children: [{
        path: 'historic',
        component: HistoricComponent
    }]
},{
    path: '',
    children: [{
        path: 'live',
        component: LiveComponent
    }]
}];
