import { InteropCommand } from '../client-interop/interop-command';
import { InteropCommandRequest } from '../client-interop/interop-command-request';
import { InteropCommandResponse } from '../client-interop/interop-command-response';
import { InteropEventBase } from '../client-interop/interop-event-base';
import { InteropQueryRequest } from '../client-interop/interop-query-request';
import { InteropQueryResponse } from '../client-interop/interop-query-response';
import { ResponseStatus } from '../client-interop/response-status';
import { Observable } from '../data/observable';
import { waitForSeconds } from '../extensions/animation.extension';
import { MessageSnackbar } from '../native-components/message-snackbar/message-snackbar';
import { PageRouting } from '../pages/page-routing/page-routing';
import { InteropProxyService } from './backend.services';

export class ClientInteropService {
    static socket: WebSocket | null;
    static commandResponse = new Observable<InteropCommandResponse>(null!);
    static queryResponse = new Observable<InteropQueryResponse>(null!);
    static eventResponse = new Observable<InteropEventBase>(null!);
    static failCounter = new Observable(0);
    static onConnected = new Observable(null);

    static sendCommand(command: Omit<InteropCommandRequest, 'ticks'>) {
        if (this.socket?.readyState != WebSocket.OPEN) {
            console.warn('Der Befehl kann nur mit Verbindung zum Client-Interop ausgeführt werden.');
            return;
        }
        return new Promise<void>(async (resolve, reject) => {
            var request = {
                ...command,
                ticks: Date.now(),
            } as InteropCommandRequest;

            while (this?.socket?.readyState != 1 /** open */) await waitForSeconds(0.1);
            this.socket.send(JSON.stringify(request));
            var subscription = this.commandResponse.subscribe((x) => {
                if (x?.ticks != request.ticks || x?.command != request.command) return;
                subscription.unsubscribe();
                if (x.status == ResponseStatus.Success) resolve();
                else reject(x.message);
            });
        });
    }

    static executeQuery<T>(query: Omit<InteropQueryRequest, 'ticks'>) {
        if (this.socket?.readyState != WebSocket.OPEN) {
            console.warn('Der Befehl kann nur mit Verbindung zum Client-Interop ausgeführt werden.');
            throw new Error('Interop läuft nicht!');
        }
        return new Promise<T>(async (resolve, reject) => {
            var request = {
                ...query,
                ticks: Date.now(),
            } as InteropQueryRequest;

            while (this?.socket?.readyState != 1 /** open */) await waitForSeconds(0.1);
            this.socket.send(JSON.stringify(request));
            var subscription = this.queryResponse.subscribe((x) => {
                if (x?.ticks != request.ticks || x?.query != request.query) return;
                subscription.unsubscribe();
                if (x.status == ResponseStatus.Success) resolve(x.result as T);
                else reject(x.message);
            });
        });
    }

    static async startConnection() {
        const controller = new AbortController();
        const timeout = waitForSeconds(5).then(() => controller.abort());
        try {
            await InteropProxyService.connectToInterop(controller.signal);
        } catch (e) {
            await timeout;
            await this.reconnect();
            return;
        }

        this.socket = new WebSocket('ws://localhost:8005/Interop');
        setTimeout(() => {
            if (!this.socket || this.socket.readyState != WebSocket.OPEN) this.failCounter.next(2);
        }, 5000);

        this.socket.onopen = async () => {
            this.onConnected.next(null);
            this.failCounter.next(0);

            await this.sendCommand({ command: InteropCommand.Register, payload: null });

            while (!PageRouting.container) await waitForSeconds(1);
            MessageSnackbar.popup('Websocket Verbindung zum Client Interop erfolgreich', 'success');
        };

        this.socket.onmessage = async (e: MessageEvent) => {
            var deserialized = JSON.parse(e.data);
            if (deserialized.command != undefined) this.commandResponse.next(deserialized);
            if (deserialized.query != undefined) this.queryResponse.next(deserialized);
            if (deserialized.event != undefined) this.eventResponse.next(deserialized);
        };

        this.socket.onclose = async (e: Event) => {
            await this.reconnect();
        };
    }

    static async reconnect() {
        this.socket = null;
        console.error('websocket connection closed, trying reconnect.');
        this.failCounter.next(2);
        await this.startConnection();
    }
}
