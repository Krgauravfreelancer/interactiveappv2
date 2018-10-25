import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
// import { TimeAgoPipe } from 'time-ago-pipe';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        MdModule
    ],
    declarations: [DashboardComponent]
    // declarations: [DashboardComponent, TimeAgoPipe],
    // exports: [TimeAgoPipe]
})

export class DashboardModule { }
