import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { LivefeedService } from '../livefeed.service';


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
export class LivefeedComponent implements OnInit, OnDestroy, OnChanges {
  socket: SocketIOClient.Socket;
  client: any;
  Messages: MessageModel[] = [];
  $msgboxlist: any;
  mesnew: any;
  @Input() Symbol: string;
  @Input() Exchange: string;
  bseColor = '#fff';
  nseColor = '#fff';
  constructor(private livefeedservice: LivefeedService) {
    this.socket = this.livefeedservice.GetSocketConnection();
    // this.socket = io('http://localhost:8080/');
  }

  ngOnChanges(sc: SimpleChanges) {
    console.log(sc);
    if (sc.Symbol && !sc.Symbol.currentValue) {
      this.Messages = [];
    } else if (sc.Exchange && !sc.Exchange.currentValue) {
      this.Messages = [];
    } else {
      this.FetchMessages();
    }
  }

  ngOnDestroy() {
    this.livefeedservice.Disconnect();
  }

  ngOnInit() {
    // this.socket = this.livefeedservice.GetSocketConnection();

    this.FetchMessages();
  }

  FetchMessages() {
    console.log(this.Symbol, this.Exchange);
    if (this.Symbol && this.Exchange) {
      this.livefeedservice.getSubscribedNewsFeed(this.Exchange, this.Symbol)
        .subscribe((messagedata) => {
          this.ManageMessages(messagedata);
          this.livefeedservice.getMesssageColor().subscribe(
            (colors: any) => {
              if (colors && colors.messagecolors) {
                this.bseColor = colors.messagecolors['BSE'];
                this.nseColor = colors.messagecolors['NSE'];
              }
            });
        });
      console.log(this.socket);
        this.socket.on('messagesChanged', (newMessages) => {
        console.log(newMessages);
        this.mesnew = newMessages;
        setTimeout(() => {
          this.ManageMessagesNew();
        }, 1000);
      });
    }
  }

  ManageMessages(msgs) {
    this.Messages = msgs;
    this.ProcessTimeStamp(true);
    this.$msgboxlist = $('.msgboxlist');
    this.$msgboxlist.perfectScrollbar();
  }

  ManageMessagesNew() {
    this.Messages = this.mesnew.msg;
    this.ProcessTimeStamp(true);
    this.$msgboxlist = $('.msgboxlist');
    this.$msgboxlist.perfectScrollbar();
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
  }

  timeConverter(unix) {
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
  }

}
