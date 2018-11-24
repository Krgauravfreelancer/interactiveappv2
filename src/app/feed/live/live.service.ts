import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as socketIo from 'socket.io-client';
import { environment } from '../../../environments/environment';


@Injectable()
export class LiveService {
    private socket;

    public initSocket(): void {
        this.socket = socketIo(environment.url);
        console.log('Connected to server.');
    }

    public onMessage(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('update', (data) => observer.next(data));
        });
    }

    public disConnectSocket(): void {
        this.socket.emit('disconnect', function () {
            console.log('Disconnected from server');
        });
    }
}
