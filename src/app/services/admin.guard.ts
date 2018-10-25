import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor( private authService: AuthService, private router: Router ) { }

  canActivate() {
    return JSON.parse(localStorage.getItem('al')) === 3486;
  }
}