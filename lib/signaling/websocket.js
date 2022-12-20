"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignallingClient = void 0;
const signaling_model_1 = require("../models/signaling.model");
const log_1 = require("../utils/log");
class SignallingClient {
    constructor(url, token, PacketHandler) {
        this.PacketHandler = PacketHandler;
        (0, log_1.LogConnectionEvent)(log_1.ConnectionEvent.WebSocketConnecting);
        this.WebSocketConnection = new WebSocket(`${url}?token=${token}`);
        this.WebSocketConnection.onopen = ((eve) => {
            this.onServerOpen(eve);
        });
    }
    /**
     * Fired whenever the signalling websocket is opened.
     * Sends the peer id to the signalling server.
     */
    onServerOpen(event) {
        (0, log_1.LogConnectionEvent)(log_1.ConnectionEvent.WebSocketConnected);
        this.WebSocketConnection.onerror = ((eve) => {
            (0, log_1.Log)(log_1.LogLevel.Error, `websocket connection error : ${eve.type}`);
            this.onServerError();
        });
        this.WebSocketConnection.onmessage = ((eve) => {
            this.onServerMessage(eve);
        });
        this.WebSocketConnection.onclose = ((eve) => {
            (0, log_1.Log)(log_1.LogLevel.Error, `websocket connection closed : ${eve.type}`);
            this.onServerError();
        });
    }
    /**
     * send messsage to signalling server
     * @param {string} request_type
     * @param {any} content
     */
    SignallingSend(Target, Data) {
        var dat = new signaling_model_1.UserRequest(0, Target, new Map(), Data).toString();
        (0, log_1.Log)(log_1.LogLevel.Debug, `sending message : ${dat}`);
        this.WebSocketConnection.send(dat);
    }
    /**
     * Fired whenever the signalling websocket emits and error.
     * Reconnects after 3 seconds.
     */
    onServerError() {
        (0, log_1.Log)(log_1.LogLevel.Warning, "websocket connection disconnected");
        (0, log_1.LogConnectionEvent)(log_1.ConnectionEvent.WebSocketDisconnected);
    }
    /**
     * handle message from signalling server during connection handshake
     * @param {Event} event
     * @returns
     */
    onServerMessage(event) {
        var msg = JSON.parse(event.data);
        var response = new signaling_model_1.UserResponse(msg.id, msg.error, msg.data);
        (0, log_1.Log)(log_1.LogLevel.Debug, `received signaling message: ${response.toString()}`);
        this.PacketHandler(response.Data);
    }
}
exports.SignallingClient = SignallingClient;
