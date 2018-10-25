import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class FeedService {

  constructor(private http: Http) { }

  public fetchHistoricTradeData(values: any) {

    let params = new URLSearchParams();

    for (let key in values) {
      if (values.hasOwnProperty(key)) {
        params.set(key, values[key]);
      }
    }

    let options = new RequestOptions({ search: params.toString() });

    return this.http.get('/historic/getHistoricTradeData', options).map(res => res.json());

  }

  public fetchLiveTradeData() {
    return this.http.get('/live/getLiveTradeData').map(res => res.json());
  }

  public fetchAllExchange() {
    return this.http.get('/live/getAllExchange').map(res => res.json());
  }

  public fetchDistinctSymbol(exchange: string[]) {
    let params = new URLSearchParams();
    params.append('exchange', exchange.toString());

    let options = new RequestOptions({ search: params.toString() });

    return this.http.get('/live/getDistinctSymbol', options).map(res => res.json());
  }

  public getSelectedItems(email){
    return this.http.get('/live/getSelectedItems/' + email).map(res => res.json());
  }

  public setSelectedItems(email, items){
    return this.http.post('/live/setSelectedItems/' + email, items).map(res => res.json());
  }

}
