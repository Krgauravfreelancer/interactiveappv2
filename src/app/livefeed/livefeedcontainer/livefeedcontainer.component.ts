import { Component, OnInit } from '@angular/core';
import { LivefeedService } from '../livefeed.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mg-livefeedcontainer',
  templateUrl: './livefeedcontainer.component.html',
  styleUrls: ['./livefeedcontainer.component.css']
})
export class LivefeedcontainerComponent implements OnInit {
  symbolSearched: string;
  exchangeSearched: string;
  exchangeSelectionItems = [];
  symbolSelectedItems = [];

  constructor(private livefeedservice: LivefeedService) { }

  ngOnInit() {
    this.livefeedservice.getSelectedItems(JSON.parse(localStorage.getItem('user')).email)
      .subscribe((userdata) => {
        if (userdata && userdata.exchange && userdata.symbols) {
          this.exchangeSelectionItems = userdata.exchange;
          this.symbolSelectedItems = userdata.symbols;
        }

        this.exchangeSearched = this.exchangeSelectionItems.map(item => item.itemName).join();
        this.symbolSearched = this.symbolSelectedItems.map(item => item.itemName).join();

      });

  }

}
