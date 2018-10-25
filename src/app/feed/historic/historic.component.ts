import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common'
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Daterangepicker, DaterangepickerConfig } from 'ng2-daterangepicker';
import { GridOptions } from 'ag-grid';

import * as moment from 'moment';

import { FeedService } from '../feed.service';

declare const require: any;

declare const $: any;

@Component({
  selector: 'mg-historic',
  templateUrl: './historic.component.html',
  styleUrls: ['./historic.component.css']
})
export class HistoricComponent implements OnInit {

  public form: FormGroup;
  public symbol: AbstractControl;
  public exchange: AbstractControl;
  public dateRangeObj: any;

  public mainInput = {
    start: moment().subtract(12, 'month'),
    end: moment().subtract(6, 'month')
  }

  public historicGridOptions: GridOptions;

  public symbolOptions = [];
  public symbolDropdownSettings = {};
  public symbolSelectedItems = [];

  public exchangeOptions = [];
  public exchangeDropdownSettings = {};
  public exchangeSelectionItems = [];

  constructor(
    fb: FormBuilder,
    private hs: FeedService,
    private datePipe: DatePipe,
    private daterangepickerOptions: DaterangepickerConfig) {
    this.form = fb.group({
      'symbol': ['', Validators.compose([Validators.required])],
      'exchange': ['', Validators.compose([Validators.required])]
    });

    this.symbol = this.form.controls['symbol'];
    this.exchange = this.form.controls['exchange'];

    this.symbolDropdownSettings = {
      singleSelection: false,
      text: "Select Symbols",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      badgeShowLimit: 3,
      enableSearchFilter: true
    };

    this.exchangeDropdownSettings = {
      singleSelection: true,
      text: "Select Exchange",
      enableSearchFilter: true
    };

    this.daterangepickerOptions.settings = {
      locale: { format: 'YYYY-MM-DD' },
      alwaysShowCalendars: false,
      showDropdowns: true
    };

    this.historicGridOptions = <GridOptions> {};
    this.historicGridOptions.columnDefs = this.getTradeGridCols();
    this.historicGridOptions.pagination = true;
    this.historicGridOptions.rowData = []; 
  }

  ngOnInit() {
    this.hs.fetchAllExchange().subscribe((data) => {
      this.exchangeOptions = [];
      for (let obj of data.data) {
        this.exchangeOptions.push({
          id: obj['ID'],
          itemName: obj['VALUE']
        });
      }
    });
  }

  onExchangeItemSelect(item) {
    this.hs.fetchDistinctSymbol(item['itemName']).subscribe((data) => {
      this.symbol.reset();
      this.symbolOptions = [];
      for (let obj of data.data) {
        this.symbolOptions.push({
          id: obj['ID'],
          itemName: obj['VALUE']
        });
      }
    });
  }

  onSubmit(values: Object) {

    values['exchange'] = values['exchange'][0].itemName;
    values['histStartDate'] = this.getFormattedDate(moment(this.dateRangeObj.start).toDate(), 'yyyy-MM-dd');
    values['histEndDate'] = this.getFormattedDate(moment(this.dateRangeObj.end).toDate(), 'yyyy-MM-dd');
    values['symbol'] = this.getSymbolArray(this.symbolSelectedItems);

    this.hs.fetchHistoricTradeData(values).subscribe(data => {
      this.historicGridOptions.api.setRowData(data.data);
    });

  }

  getSymbolArray(symbolSelectedItems: any) {
    let symbolValueArr = [];
    for (let symObj of this.symbolSelectedItems) {
      symbolValueArr.push(symObj['itemName']);
    }
    return symbolValueArr;
  }

  getFormattedDate(date: Date, format: string) {
    return this.datePipe.transform(date, format);
  }

  public selectedDate(value: any, dateInput: any) {
    this.mainInput.start = value.start;
    this.mainInput.end = value.end;
    this.dateRangeObj = value;
  }

  getHistTradeDataKeys(row: Object): Array<string> {
    return Object.keys(row);
  }

  getTradeGridCols() {
    return [
      { headerName: 'Symbol', field: 'SYMBOL' },
      { headerName: 'Trade', field: 'TRADE' },
      { headerName: 'Price #1', field: 'PRICE_1' },
      { headerName: 'Date #1', field: 'DATE_1' },
      { headerName: 'Price #2', field: 'PRICE_2' },
      { headerName: 'Date #2', field: 'DATE_2' },
      { headerName: 'Cash Futures', field: 'CASH_FUTURES' },
      { headerName: 'Exchange', field: 'EXCHANGE' }
    ];
  }

}
