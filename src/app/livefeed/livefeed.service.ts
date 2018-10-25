import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
// import { environment } from '../../environments/environment';

@Injectable()
export class LivefeedService {

  key = 'SA4L4AKLG5BWWGLK';
  constructor(private http: Http) { }

  public fetchAllSymbols(searchText) {
    const params = new URLSearchParams();
    params.append('search', searchText);
    const options = new RequestOptions({ search: params.toString() });
    // return this.http.get(environment.url + '/live/getAllSymbols', options).map(res => res.json());
    return this.http.get('/live/getAllSymbols', options).map(res => res.json());
  }

  public fetchStockData(stockname) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockname}&apikey=${this.key}`;
    return this.http.get(url).map(res => res.json());
  }

  /*
  public fetchLiveTradeData() {
    return this.http.get(environment.url + '/live/getLiveTradeData').map(res => res.json());
  }

  public fetchAllExchange() {
    return this.http.get(environment.url + '/live/getAllExchange').map(res => res.json());
  }

  public fetchDistinctSymbol(exchange: string[]) {
    const params = new URLSearchParams();
    params.append('exchange', exchange.toString());

    const options = new RequestOptions({ search: params.toString() });

    return this.http.get(environment.url + '/live/getDistinctSymbol', options).map(res => res.json());
  }
  */

  public getSelectedItems(email) {
    // return this.http.get(environment.url + '/live/getSelectedItems/' + email).map(res => res.json());
    return this.http.get('/live/getSelectedItems/' + email).map(res => res.json());
  }

  public setSelectedItems(email, items) {
    // return this.http.post(environment.url + '/live/setSelectedItems/' + email, items).map(res => res.json());
    return this.http.post('/live/setSelectedItems/' + email, items).map(res => res.json());
  }

  public getSubscribedNewsFeed(exchanges, symbols) {

    const params = new URLSearchParams();
    params.append('exchange', exchanges);
    params.append('symbol', symbols);
    console.log(params.toString());

    const options = new RequestOptions({ search: params.toString() });
    // return this.http.get(environment.url + '/live/messages', options).map(res => res.json());
    return this.http.get('/live/messages', options).map(res => res.json());
  }

}
