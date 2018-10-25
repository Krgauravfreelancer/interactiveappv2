import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';

@Injectable()
export class RegisterService {

  user: string = '';

  constructor(private http: Http) { }

  get windowRef() {
    return window;
  }

  public fetchAllCountries() {
    return this.http.get('/auth/findCountries').map(res => res.json());
  }

  public fetchAllStates(country: string) {
    let params = new URLSearchParams();
    params.append('country', country);
    let options = new RequestOptions({search: params.toString()});

    return this.http.get('/auth/fetchAllStates', options).map(res => res.json());
    // return this.http.get(environment.url + '/auth/fetchAllStates', options).map(res => res.json());
  }

  public saveUser(values: Object) {
    delete values['confPass'];
    this.user = values['username'];
    return this.http.post('/auth/register', values).map(res => res.json());
    // return this.http.post(environment.url + '/auth/register', values).map(res => res.json());
  }

  public getUserFromFirebase(username) {
    return this.http.get('/auth/fetchUser/' + username).map(res => res.json());
    // return this.http.get(environment.url + '/auth/fetchUser/' + username).map(res => res.json());
  }

  public verifyEmail(email){
    return this.http.get('/auth/emailExists?email=' + email).map(res => res.json());
    // return this.http.get(environment.url + '/auth/emailExists?email=' + email).map(res => res.json());
  }

  public verifyPhone(email){
    return this.http.get('/auth/phoneExists?email=' + email).map(res => res.json());
    // return this.http.get(environment.url + '/auth/phoneExists?email=' + email).map(res => res.json());
  }

  public verifyUserId(email){
    return this.http.get('/auth/userIdExists?email=' + email).map(res => res.json());
    // return this.http.get(environment.url + '/auth/userIdExists?email=' + email).map(res => res.json());
  }

  public phoneVerified(username){
    this.user = username;
    return this.http.get('/auth/phoneVerified/' + username).map(res => res.json());
    // return this.http.get(environment.url + '/auth/phoneVerified/' + username).map(res => res.json());
  }

  public emailVerified(uid, username){
    this.user = username;
    return this.http.get('/auth/emailVerified/' + uid + '/' + username).map(res => res.json());
    // return this.http.get(environment.url + '/auth/emailVerified/' + uid + '/' + username).map(res => res.json());
  }

  public getTradingExperience() {
    return [
      {itemName: "0", id: 0},
      {itemName: "1-5", id: 1},
      {itemName: "6-10", id: 2},
      {itemName: "10+", id: 3}
    ];
  }

  public getTradeTimes() {
    return [
      {itemName: "0", id: 0},
      {itemName: "1-10", id: 1},
      {itemName: "10-50", id: 2},
      {itemName: "50+", id: 3}
    ];
  }

  public getBrokerageAccOption() {
    return [
      { itemName: "Yes", id: 0 },
      { itemName: "No", id: 1 }
    ];
  }

  public getInterest() {
    return [
      { itemName: 'Equities', id: 0 },
      { itemName: 'Options', id: 1 },
      { itemName: 'Futures', id: 2 },
      { itemName: 'Forex', id: 3 },
      { itemName: 'Exchange-traded funds(ETFs)', id: 4 }
    ];
  }

  public setCurrentUser(username){
    this.user = username;
  }

  public getCurrentUser(){
    return this.user;
  }

}
