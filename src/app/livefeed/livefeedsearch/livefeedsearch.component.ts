import { Component, OnInit, OnDestroy } from '@angular/core';
import { LivefeedService } from '../livefeed.service';
import { LoaderService } from '../../shared/loader.service';

declare const $: any;

export interface LiveSymbolDataModel {
  Company: string;
  StockName: string;
  StockPrice: number;
  StockChange: number;
  StockChangePercent: string;
  StockUpdated: string;
  StockFlag?: boolean;
  Exchange: string;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mg-livefeedsearch',
  templateUrl: './livefeedsearch.component.html',
  styleUrls: ['./livefeedsearch.component.css']
})
export class LivefeedsearchComponent implements OnInit, OnDestroy {
  searchText = '';
  symbolList = [];
  stockData: LiveSymbolDataModel;
  interval: any;
  $search_suggestion: any;
  exchangeSelectionItems = [];
  symbolSelectedItems = [];

  constructor(private livefeedservice: LivefeedService,
    private ls: LoaderService) { }

  ngOnInit() {
    this.livefeedservice.getSelectedItems(JSON.parse(localStorage.getItem('user')).email)
      .subscribe((data) => {
        if (data && data.exchange && data.symbols) {
          this.exchangeSelectionItems = data.exchange;
          this.symbolSelectedItems = data.symbols;
          console.log(this.exchangeSelectionItems, this.symbolSelectedItems);
        }
      });
  }

  DisplaySymbols() {
    if (!this.searchText) {
      this.symbolList.splice(0);
      return;
    }

    this.livefeedservice.fetchAllSymbols(this.searchText)
      .subscribe((data) => {
        this.symbolList = data;
        const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
        // if we are on windows OS we activate the perfectScrollbar function
        if (isWindows) {
          if (this.symbolList && this.symbolList.length > 8) {
            this.$search_suggestion = $('.SearchSuggestions');
            this.$search_suggestion.perfectScrollbar();
          } else {
            if (this.$search_suggestion) {
              $('.SearchSuggestions').addClass('perfect-scrollbar-off');
              // this.$search_suggestion.update();
            }
          }
        }
      });
  }


  ShowStockData(option) {
    this.ls.display(true);
    this.ClearAll();
    let searchSymbol = option.Symbol;
    // To be commented
    searchSymbol = option.Symbol === 'DISHTV' ? 'DLTR' : 'AAPL';
    this.livefeedservice.fetchStockData(searchSymbol)
      .subscribe((result) => {
        if (result) {
          this.RestartInterval(searchSymbol);
          this.stockData = {
            Exchange: option.Exchange,
            Company: option.Exchange,
            StockName: option.Symbol,
            StockChange: +(+result['Global Quote']['09. change']).toFixed(2),
            StockPrice: +(+result['Global Quote']['05. price']).toFixed(2),
            StockChangePercent: this.CalculatePercentage(result['Global Quote']['10. change percent']),
            StockUpdated: this.GetFormattedDate(new Date(result['Global Quote']['07. latest trading day']))
          };
          this.stockData.StockFlag = this.stockData.StockChange >= 0 ? true : false;
        }
        this.ls.display(false);
      });
  }

  CalculatePercentage(value) {
    if (value) {
      const val = +value.substr(value.length - 2, 1);
      return val.toFixed(2) + '%';
    }
    return '0.00%';
  }

  ClearAll() {
    this.searchText = '';
    this.symbolList.splice(0);
    // this.stockData = undefined;
  }

  ClearInterval() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  RestartInterval(symbol) {
    this.ClearInterval();
    this.interval = setInterval(() => {
      this.RefreshStockData(symbol);
    }, 20000);
  }

  async RefreshStockData(symbol) {
    this.livefeedservice.fetchStockData(symbol)
      .subscribe(result => {
        if (result && result['Global Quote']) {
          console.log(result);
          this.stockData.StockChange = +(+result['Global Quote']['09. change']).toFixed(2);
          this.stockData.StockPrice = +(+result['Global Quote']['05. price']).toFixed(2);
          this.stockData.StockChangePercent = this.CalculatePercentage(result['Global Quote']['10. change percent']);
          this.stockData.StockUpdated = this.GetFormattedDate(new Date(result['Global Quote']['07. latest trading day']));
          this.stockData.StockFlag = this.stockData.StockChange >= 0 ? true : false;
        }
      });
  }

  GetFormattedDate(date) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  StartWatching(newexchange, newsymbol) {

    const exchanges = this.exchangeSelectionItems.map(item => item.itemName);
    const symbols = this.symbolSelectedItems.map(item => item.itemName);

    if (exchanges.indexOf(newexchange) < 0) {
      exchanges.push(newexchange);
    }
    if (symbols.indexOf(newsymbol) < 0) {
      symbols.push(newsymbol);
    }
    console.log(exchanges, symbols, newexchange, newsymbol);
    const options = {
      exchange: exchanges,
      symbols: symbols
    };

    this.livefeedservice.setSelectedItems(JSON.parse(localStorage.getItem('user')).email, options)
      .subscribe(res => {
        if (res && res.body) {
          console.log(res.body);
        }
      });
  }

  ngOnDestroy() {
    this.ClearInterval();
  }
}