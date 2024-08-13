import { InteropCommandRequest } from '../client-interop/interop-command-request.js';
import { InteropCommandResponse } from '../client-interop/interop-command-response.js';
import { InteropEventResponse } from '../client-interop/interop-event-response.js';
import { InteropQueryRequest } from '../client-interop/interop-query-request.js';
import { InteropQueryResponse } from '../client-interop/interop-query-response.js';
import { ResponseStatus } from '../client-interop/response-status.js';
import { Observable } from '../data/observable.js';
import { MessageSnackbar } from '../native-components/message-snackbar/message-snackbar.js';
import { InteropProxyService } from './backend.services.js';
import { waitForSeconds } from './extensions/animation.extension.js';

export class ClientInteropService {
    /** @type {WebSocket} */ static socket;
    /** @type {Observable<InteropCommandResponse>} */ static commandResponse = new Observable(null);
    /** @type {Observable<InteropQueryResponse>} */ static queryResponse = new Observable(null);
    /** @type {Observable<InteropEventResponse>} */ static eventResponse = new Observable(null);
    /** @type {Observable<number>} */ static failCounter = new Observable(0);
    static onConnected = new Observable(null);

    /**
     * @param {Omit<InteropCommandRequest, 'ticks'>} command
     */
    static sendCommand(command) {
        if (this.socket?.readyState != WebSocket.OPEN) {
            console.warn('Der Befehl kann nur mit Verbindung zum Client-Interop ausgeführt werden.');
            return;
        }
        return new Promise(async (resolve, reject) => {
            /** @type {InteropCommandRequest} */ var request = {
                ...command,
                ticks: Date.now(),
            };

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

    /**
     * @param {Omit<InteropQueryRequest, 'ticks'>} query
     */
    static executeQuery(query) {
        if (this.socket?.readyState != WebSocket.OPEN) {
            console.warn('Der Befehl kann nur mit Verbindung zum Client-Interop ausgeführt werden.');
            return;
        }
        return new Promise(async (resolve, reject) => {
            /** @type {InteropQueryRequest} */ var request = {
                ...query,
                ticks: Date.now(),
            };

            while (this?.socket?.readyState != 1 /** open */) await waitForSeconds(0.1);
            this.socket.send(JSON.stringify(request));
            var subscription = this.queryResponse.subscribe((x) => {
                if (x?.ticks != request.ticks || x?.query != request.query) return;
                subscription.unsubscribe();
                if (x.status == ResponseStatus.Success) resolve(x.result);
                else reject(x.message);
            });
        });
    }

    /**
     * @prop {number} duration
     * @prop {Observable<number>} position
     */
    static async startConnection() {
        setTimeout(() => {
            if (this.socket?.readyState != WebSocket.OPEN) this.failCounter.next(2);
        }, 5000);

        await InteropProxyService.connectToInterop();
        this.socket = await this.#tryConnect();
        console.log('websocket connection successfull');
        this.onConnected.next(null);
        this.failCounter.next(0);
        MessageSnackbar.popup('Websocket Verbindung zum Client Interop erfolgreich', 'success');

        this.socket.onmessage = async (e) => {
            var deserialized = JSON.parse(e.data);
            if (/** @type {InteropCommandResponse} */ (deserialized).command != undefined)
                this.commandResponse.next(deserialized);
            if (/** @type {InteropQueryRequest} */ (deserialized).query != undefined) this.queryResponse.next(deserialized);
            if (/** @type {InteropEventResponse} */ (deserialized).event != undefined) this.eventResponse.next(deserialized);
        };

        this.socket.onclose = async (e) => {
            this.socket = null;
            console.error('websocket conection closed, trying reconnect.');
            this.failCounter.next(this.failCounter.current() + 1);
            await this.startConnection();
        };
    }

    static #tryConnect() {
        return new Promise((resolve, reject) => {
            var socket = new WebSocket('ws://localhost:8005/Interop');
            socket.onopen = () => resolve(socket);
            socket.onclose = reject;
        });
    }
}
