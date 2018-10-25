import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Daterangepicker } from 'ng2-daterangepicker';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { AgGridModule } from 'ag-grid-angular';

import { FeedService } from './feed.service';
import { FeedRoutes } from './feed.routing';

import { HistoricComponent } from './historic/historic.component';
import { LiveComponent } from './live/live.component';
import { LiveService } from './live/live.service';

@NgModule({
  imports: [
    AngularMultiSelectModule,
    AgGridModule.withComponents([]),
    CommonModule,
    Daterangepicker,
    RouterModule.forChild(FeedRoutes),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    HistoricComponent,
    LiveComponent
  ],
  providers: [
    FeedService,
    DatePipe,
    LiveService
  ]
})

export class FeedModule {}
