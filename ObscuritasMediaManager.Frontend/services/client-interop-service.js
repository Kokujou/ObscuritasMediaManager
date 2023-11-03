import { InteropCommandRequest } from '../client-interop/interop-command-request.js';
import { InteropCommandResponse } from '../client-interop/interop-command-response.js';
import { InteropEventResponse } from '../client-interop/interop-event-response.js';
import { InteropQueryRequest } from '../client-interop/interop-query-request.js';
import { InteropQueryResponse } from '../client-interop/interop-query-response.js';
import { ResponseStatus } from '../client-interop/response-status.js';
import { Observable } from '../data/observable.js';
import { waitForSeconds } from './extensions/animation.extension.js';

export class ClientInteropService {
    /** @type {WebSocket} */ static socket;
    /** @type {Observable<InteropCommandResponse>} */ static commandResponse = new Observable(null);
    /** @type {Observable<InteropQueryResponse>} */ static queryResponse = new Observable(null);
    /** @type {Observable<InteropEventResponse>} */ static eventResponse = new Observable(null);
    /** @type {Observable<number>} */ static failCounter = new Observable(0);

    /**
     * @param {Omit<InteropCommandRequest, 'ticks'>} command
     */
    static sendCommand(command) {
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
        while (true) {
            await waitForSeconds(3);
            try {
                await fetch('http://localhost:8005/Interop', { mode: 'no-cors', redirect: 'follow' });
                this.socket = await this.#tryConnect();
                this.failCounter.next(0);
                break;
            } catch {
                console.error('websocket conection closed, trying reconnect.');
                this.failCounter.next(this.failCounter.current() + 1);
            }
        }

        this.socket.onmessage = (e) => {
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
            socket.onopen = () => {
                console.log('websocket connection successfull');
                resolve(socket);
            };

            socket.onclose = reject;
        });
    }
}
ClientInteropService.startConnection();
