import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '../../../node_modules/@angular/router';
import { AuthService } from '../services/auth.service';

declare const $: any;

// Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    // icon: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

// Menu Items
// export let ROUTES: RouteInfo[] = [];
@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    displayName: '';
    ROUTES: RouteInfo[] = [];

    constructor(private route: Router, private authService: AuthService) {
        const user = JSON.parse(localStorage.getItem('user'));
        this.displayName = user.displayName || '';
        if (JSON.parse(localStorage.getItem('al')) === 3486) {
            this.ROUTES = [{
                path: '/dashboard',
                title: 'Dashboard',
                type: 'link',
                icontype: 'dashboard'
            }, {
                path: '/feed',
                title: 'Feeds',
                type: 'sub',
                icontype: 'timeline',
                children: [
                    { path: 'live', title: 'Live', ab: 'L' },
                    { path: 'historic', title: 'Historic', ab: 'H' }
                ]
            }, {
                path: '/users/userManagement',
                title: 'Users',
                type: 'link',
                icontype: 'people'
            }];
        } else {
            this.ROUTES = [{
                path: '/dashboard',
                title: 'Dashboard',
                type: 'link',
                icontype: 'dashboard'
            }, {
                path: '/feed',
                title: 'Feeds',
                type: 'sub',
                icontype: 'timeline',
                children: [
                    { path: 'live', title: 'Live', ab: 'L' },
                    { path: 'historic', title: 'Historic', ab: 'H' }
                ]
            },
            {
                path: '/livefeed',
                title: 'LiveFeed',
                type: 'link',
                icontype: 'rss_feed'
            },
            {
                path: '/livefeedsearch',
                title: 'Feed Search',
                type: 'link',
                icontype: 'search'
            }
            ];
        }
    }

    isNotMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }

    ngOnInit() {
        const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
        if (isWindows) {
            // if we are on windows OS we activate the perfectScrollbar function
            const $sidebar = $('.sidebar-wrapper');
            $sidebar.perfectScrollbar();
            // if we are on windows OS we activate the perfectScrollbar function
            $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();
            $('html').addClass('perfect-scrollbar-on');
        } else {
            $('html').addClass('perfect-scrollbar-off');
        }
        this.menuItems = this.ROUTES.filter(menuItem => menuItem);
    }

    logout() {
        this.authService.logout();
        this.route.navigate(['/login']);
    }
}
