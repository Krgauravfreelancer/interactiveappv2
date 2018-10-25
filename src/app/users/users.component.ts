import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { GridOptions } from 'ag-grid';
import { ComboBoxComponent } from './combo-box/combo-box.component';
import { environment } from '../../environments/environment';
import swal from 'sweetalert2';

@Component({
  selector: 'mg-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  admins = [];
  changes = [];
  frameworkComponents = {
    comboBoxComponent: ComboBoxComponent
  };

  rowData;
  gridOptions: GridOptions;
  constructor(private http: Http) {    
    this.gridOptions = <GridOptions>{
      columnDefs: this.createColumnDefs(),
      onGridSizeChanged: () => {
        this.gridOptions.api.sizeColumnsToFit();
      }
    };
  }

   ngOnInit() {
    this.http.get( environment.url + '/user/gusers').subscribe(res=>{
      this.gridOptions.api.setRowData(JSON.parse(res['_body']));
    });
  }


  createColumnDefs() {
    return [
      { headerName: 'First Name', field: 'firstname' },
      { headerName: 'Last Name', field: 'lastname' },
      { headerName: 'Username', field: 'username' },
      { headerName: 'Email', field: 'email' },
      { headerName: 'Phone', field: 'phone'},
      { headerName: 'Follows', field: 'follows', cellEditor: 'comboBoxComponent', editable: true},
      { headerName: 'User Type', field: 'userType' },
      { headerName: 'Address Line1', field: 'addressLine1' },
      { headerName: 'Address Line2', field: 'addressLine2' },
      { headerName: 'City', field: 'city' },      
      { headerName: 'Pincode', field: 'pincode' },
      { headerName: 'State', field: 'state' },
      { headerName: 'country', field: 'Country' }
    ];
  }

  saveData() {
    if(this.changes.length > 0){
      const headers = new Headers();
      headers.append('Content-Type', 'application/json; charset=utf-8')
      this.http.post(environment.url + '/user/changes', {changes:this.changes}, {headers: headers}).subscribe(res=>{
        let response = JSON.parse(res['_body']);
        if(response['code'] === 0){
          swal('Success', 'Changes have been saved successfully', 'success');
        } else {
          swal('Error',response['message'], 'error');
        }
      });
      this.changes = [];

    } else {
      swal('Nothing to save...', '', 'info');
    }
  }

  valueChanged(event){
    this.changes.push({uuid: event.data.uuid, newValue: event.newValue});
  }

  onFilterChanged(value){
    this.gridOptions.api.setQuickFilter(value);
   }

}
