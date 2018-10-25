import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from './data.service';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.css']
})
export class ComboBoxComponent implements OnInit, ICellEditorAngularComp {

  @ViewChild('mat') mat;
  users: any = [];
  admins: any = [];

  constructor(private dataservice: DataService) {}

  ngOnInit() {
    this.users = this.dataservice.getAdminUsers();    
  }

  refresh(params: any): boolean {
    return false;
  }

  public params: any;

  agInit(params: any): void {    
      this.params = params;
      this.admins = this.params.value;    
  }

  isPopup(): boolean {
    return false;
  }

  public getValue(){
    return this.admins;
  }
}