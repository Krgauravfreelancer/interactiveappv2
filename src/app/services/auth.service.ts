import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase';
import swal from 'sweetalert2';


@Injectable()
export class AuthService {

  constructor() {}

  private loggedIn = new BehaviorSubject<boolean>(this.isTokenPresent());
  
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  isTokenPresent(){
    return !!localStorage.getItem('user');
  }

  login(){
    this.loggedIn.next(true);
  }

  logout() {
    firebase.auth().signOut().then(function() {
      swal('Logged out', 'You have been successfully logged out', 'info');
    }).catch(function(error) {
      console.log(error);
    });
    this.loggedIn.next(false);
    localStorage.clear();
  }

  
}
