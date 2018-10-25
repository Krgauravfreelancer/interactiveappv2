import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment';

export interface User {
  active: boolean,
  address: string,
  brokerageAcc: boolean,
  city: string,
  confirmPwd: string,
  country: string,
  email: string,
  emailConfirm: string,
  firstname: string,
  follows: string[],
  interest: {
    equities: true,
    etfs: false,
    forex: true,
    futures: false,
    options: false
  },
  lastname: string,
  middleName: string,
  optionalAddress: string,
  password: string,
  phoneNumber: string,
  phoneVerified: boolean,
  state: string,
  tradeExperience: string,
  tradeTimes: string,
  uid: string,
  username: string,
  userType: string,
  zipcode: string
}

@Injectable()
export class DataService {


  users: User[] = [];

  adminUsers: User[] = [];

  constructor(private http: HttpClient) { }

  getDataUsingSubscribe(): Promise<User[]> {
    return this.http.get<User[]>(environment.url + '/user/users').toPromise();
  }

  async getUsers() {
    if (this.users.length == 0) {
      await this.getDataUsingSubscribe().then(data => {
        this.users = data.filter(item=>item.userType.toLowerCase() === 'general');
        this.adminUsers = data.filter(item=>item.userType.toLowerCase() === 'admin');
      });
    }

    return this.users;

  }

  async getAdminUsers(){
    if(this.adminUsers.length === 0){
      await this.getUsers();
    }
    
    return this.adminUsers;
    
  }

  
}
