import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { ComboBoxComponent } from './combo-box/combo-box.component';
import { MatSelectModule } from '@angular/material/select';
import { AgGridModule } from 'ag-grid-angular';
import { UsersRoutes } from './users.routing';
import { DataService } from './combo-box/data.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [ 
        RouterModule.forChild(UsersRoutes), 
        CommonModule,
        HttpClientModule,
        MatSelectModule,
        AgGridModule.withComponents([ComboBoxComponent])
    ],
    declarations: [ 
        UsersComponent, 
        ComboBoxComponent
    ],
    exports: [ UsersComponent ],
    providers: [DataService]
})

export class UsersModule {}
