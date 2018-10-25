import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { LivefeedService } from '../livefeed.service';
import { Subscription } from 'rxjs/Subscription';
import * as io from 'socket.io-client';

declare const $: any;

export interface MessageModel {
  MessageText: string;
  UnixTimeStamp: string;
  MessageDate: string;
  Exchange: string;
  UnixToLocal?: string;
  RelativeTime?: string;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mg-livefeed',
  templateUrl: './livefeed.component.html',
  styleUrls: ['./livefeed.component.css']
})
export class LivefeedComponent implements OnInit, OnDestroy {
  socket: SocketIOClient.Socket;
  client: any;
  exchangeSelectionItems = [];
  symbolSelectedItems = [];
  Messages: MessageModel[] = [];
  constructor(private livefeedservice: LivefeedService) {
    this.socket = io('http://localhost:8080/');

  }

  ngOnDestroy() {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  ngOnInit() {
    this.livefeedservice.getSelectedItems(JSON.parse(localStorage.getItem('user')).email)
      .subscribe((userdata) => {
        if (userdata && userdata.exchange && userdata.symbols) {
          this.exchangeSelectionItems = userdata.exchange;
          this.symbolSelectedItems = userdata.symbols;
          console.log(this.exchangeSelectionItems, this.symbolSelectedItems);
        }

        const exchanges = this.exchangeSelectionItems.map(item => item.itemName).join();
        const symbols = this.symbolSelectedItems.map(item => item.itemName).join();

        this.livefeedservice.getSubscribedNewsFeed(exchanges, symbols)
          .subscribe((messagedata) => {
            this.Messages = messagedata;
            console.log(messagedata);
            this.ProcessTimeStamp(true);
          });
        this.socket.on('messagesChanged', (newMessages) => {
          this.Messages = newMessages.msg;
          console.log(newMessages.msg);
          this.ProcessTimeStamp(true);
        });

      });

  }

  ProcessTimeStamp(sortflag?: boolean) {
    this.Messages.forEach((element) => {
      element.UnixToLocal = this.timeConverter(element.UnixTimeStamp);
      element.RelativeTime = moment(element.UnixToLocal).fromNow().toString();
    });
    if (sortflag) {
      this.Messages.sort((n1, n2) => {
        if (n1.UnixTimeStamp > n2.UnixTimeStamp) {
          return -1;
        }

        if (n1.UnixTimeStamp < n2.UnixTimeStamp) {
          return 1;
        }

        return 0;
      });
    }
    // console.log(this.Messages);
  }

  PrepareMessages(exchanges, symbols, messages) {
    exchanges.forEach(excs => {
      const exc = excs.itemName;
      symbols.forEach(syms => {
        const sym = syms.itemName;
        if (messages && messages[exc] && messages[exc][sym]) {
          const objArray = Object.values(messages[exc][sym]);
          for (let index = 0; index < objArray.length; index++) {
            const obj = objArray[index];
            for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                const element = obj[key];
                // console.log(element, key);
                this.Messages.push({
                  Exchange: exc,
                  MessageDate: element.substr(0, 9),
                  UnixTimeStamp: key,
                  MessageText: element.substr(17)
                });
              }
            }
          }
          this.ProcessTimeStamp(true);
          // console.log(this.Messages);
        }
      });
    });
  }


  timeConverter(unix) {
    // const a = new Date(unix * 1000);
    // const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // const year = a.getFullYear();
    // const month = months[a.getMonth()];
    // const date = a.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    // const hour = a.getHours().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    // const min = a.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    // const sec = a.getSeconds().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    // const time = date + ' ' + month + ' ' + year + ', ' + hour + ':' + min + ':' + sec;
    // return time;
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return new Date(unix * 1000).toLocaleDateString('en-US', options);

    // return new Date(unix * 1000).toISOString();
    // .toISOString();
  }

}
