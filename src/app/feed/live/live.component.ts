import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeedService } from '../feed.service';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { GridOptions, ColumnApi, GridApi } from 'ag-grid';
import { LoaderService } from '../../shared/loader.service';
import { LiveService } from './live.service';

@Component({
  selector: 'mg-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public symbol: AbstractControl;
  public exchange: AbstractControl;

  public liveGridApi: GridApi;
  public liveGridOptions: GridOptions;
  public liveColumnApi: ColumnApi;

  public symbolOptions = [];
  public symbolDropdownSettings = {};
  public symbolSelectedItems = [];

  public exchangeOptions = [];
  public exchangeDropdownSettings = {};
  public exchangeSelectionItems = [];

  public liveTradeFirebaseData: any;
  public rowData = [];

  // public timer;

  constructor(fb: FormBuilder, private hs: FeedService, private loaderService: LoaderService, private socketService: LiveService) {

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
      unSelectAllText: 'Unselect All',
      badgeShowLimit: 3,
      enableSearchFilter: true
    };

    this.exchangeDropdownSettings = {
      singleSelection: false,
      text: "Select Exchange",
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      badgeShowLimit: 3,
      enableSearchFilter: true
    };

    this.liveGridOptions = <GridOptions>{};
    this.liveGridOptions.columnDefs = [
      { headerName: 'Exchange', field: 'Exchange' },
      { headerName: 'Symbol', field: 'Symbol' },
      { headerName: 'Trade', field: 'Trade' },
      { headerName: 'Price', field: 'Price' },
      { headerName: 'Timestamp', field: 'Date', cellRenderer: 'agAnimateShowChangeCellRenderer', comparator: dateComparator, sort: 'desc', suppressSorting: false }
    ];
    this.liveGridOptions.rowData = [];

    function dateComparator(date1, date2) {

      var date1Number = new Date(date1).getTime();
      var date2Number = new Date(date2).getTime();

      if (date1Number === date2Number) {
        return 0;
      }
      if (date1Number < date2Number) {
        return -1;
      }
      if (date1Number > date2Number) {
        return 1;
      }

    }

  }

  private openSocketConnection(): void {

    this.socketService.initSocket();

    this.socketService.onMessage().subscribe((data) => {
      let updatedItems = [];
      Object.keys(data).forEach(key => {
        updatedItems.push(data[key]);
      });

      let itemsToUpdate = [];
      let rowNodes = [];
      updatedItems.forEach(item => {
        this.liveGridApi.forEachNodeAfterFilterAndSort((node) => {
          let data = node.data;
          if (data.Symbol === item.Symbol) {
            Object.keys(data).forEach(key => {
              data[key] = item[key]
            })
            itemsToUpdate.push(data);
            rowNodes.push(node);
          }
        })
      });

      this.liveGridApi.flashCells({ rowNodes: rowNodes });
      this.liveGridApi.updateRowData({ update: itemsToUpdate });

    });

  }

  ngOnInit() {
    this.loaderService.display(true);
    this.hs.fetchAllExchange().subscribe((data) => {

      this.exchangeOptions = [];
      for (let obj of data) {
        this.exchangeOptions.push({
          id: obj['ID'],
          itemName: obj['VALUE']
        });
      }
    });

    this.hs.getSelectedItems(JSON.parse(localStorage.getItem('user')).email).subscribe((data) => {
      this.exchangeSelectionItems = data.exchange;
      this.symbolSelectedItems = data.symbols;
      this.onExchangeItemSelect(null);
      this.onSymbolItemSelect(null);
    })

    this.loaderService.display(false);
    this.openSocketConnection();
  }

  onGridReady(params) {
    this.liveGridApi = params.api;
    this.liveColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  onGridChange(params) {
    this.liveGridApi.sizeColumnsToFit();

  }

  onExchangeItemSelect(item) {

    this.hs.fetchDistinctSymbol(this.exchangeSelectionItems.map(item => item['itemName'])).subscribe((data) => {
      this.symbolOptions = [];
      for (let obj of data) {
        this.symbolOptions.push({
          id: obj['ID'],
          data: obj['VALUE'],
          itemName: obj['VALUE']['Symbol']
        });
      }
    });
  }

  onExchangeItemDeselect(item) {
    if (this.exchangeSelectionItems.length === 0) {
      this.symbol.reset();
      this.symbolOptions = [];
      this.liveGridOptions.api.setRowData([])
      // clearTimeout(this.timer);
      this.setSelected();
    } else {
      let exchangeList = this.exchangeSelectionItems.map(item => item.itemName);
      let newSymbolList = this.symbolSelectedItems.filter(item => {
        if (exchangeList.includes(item.data.Exchange))
          return item;
      })
      this.symbolSelectedItems = newSymbolList;

      let newSymbolOptionsList = this.symbolOptions.filter(item => {
        if (exchangeList.includes(item.data.Exchange))
          return item;
      })
      this.symbolOptions = newSymbolOptionsList;


      this.rowData = this.symbolSelectedItems.map(symbol => symbol.data);
      this.liveGridOptions.api.setRowData(this.rowData);
      this.setSelected();
    }

  }

  onExchangeItemDeselectAll(item) {
    this.symbol.reset();
    this.symbolOptions = [];
    this.liveGridOptions.api.setRowData([])
    // clearTimeout(this.timer);
    this.exchangeSelectionItems = [];
    this.symbolSelectedItems = [];
    this.setSelected();
  }

  onSymbolItemSelect(item) {

    if (item)
      this.setSelected();   // A null means that selection is not from grid
    this.rowData = this.symbolSelectedItems.map(symbol => symbol.data);

    this.liveGridOptions.api.setRowData(this.rowData);
    // clearTimeout(this.timer);
    // if(this.symbolSelectedItems.length > 0){
    //   this.timeoutTarget(this.liveGridApi);
    // }
  }

  timeoutTarget(gridApi) {
    this.hs.fetchLiveTradeData().subscribe((data) => {
      let updatedItems = [];
      Object.keys(data).forEach(key => {
        updatedItems.push(data[key]);
      });

      let itemsToUpdate = [];
      let rowNodes = [];
      updatedItems.forEach(item => {
        gridApi.forEachNodeAfterFilterAndSort((node, index) => {
          let data = node.data;
          if (data.Symbol === item.Symbol) {
            Object.keys(data).forEach(key => {
              data[key] = item[key]
            })
            itemsToUpdate.push(data);
            rowNodes.push(node);
          }
        })
      });


      gridApi.flashCells({ rowNodes: rowNodes });
      gridApi.updateRowData({ update: itemsToUpdate });


    });
    // this.timer = setTimeout(this.timeoutTarget.bind(this), 2000, gridApi);
  }

  setSelected() {
    let exchange = this.exchangeSelectionItems.map(item => item.itemName);
    let symbols = this.symbolSelectedItems.map(item => item.itemName);

    this.hs.setSelectedItems(JSON.parse(localStorage.getItem('user')).email, { exchange: exchange, symbols: symbols }).subscribe(res => { });
  }


  deleteRows() {
    let deletionSymbols = this.liveGridApi.getSelectedNodes().map(node => node.data.Symbol);
    let diff = this.symbolSelectedItems.filter(selectedItem => {
      if (deletionSymbols.indexOf(selectedItem.itemName) === -1) {
        return selectedItem;
      }
    })

    this.symbolSelectedItems = diff;
    this.rowData = this.symbolSelectedItems.map(symbol => symbol.data);
    this.liveGridOptions.api.setRowData(this.rowData);
    this.setSelected();

  }

  ngOnDestroy() {
    this.socketService.disConnectSocket();
  }

}
