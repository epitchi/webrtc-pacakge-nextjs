export declare class SignallingClient {
    WebSocketConnection: WebSocket;
    PacketHandler: ((Data: Map<string, string>) => (void));
    constructor(url: string, token: string, PacketHandler: ((Data: Map<string, string>) => (void)));
    /**
     * Fired whenever the signalling websocket is opened.
     * Sends the peer id to the signalling server.
     */
    private onServerOpen;
    /**
     * send messsage to signalling server
     * @param {string} request_type
     * @param {any} content
     */
    SignallingSend(Target: string, Data: Map<string, string>): void;
    /**
     * Fired whenever the signalling websocket emits and error.
     * Reconnects after 3 seconds.
     */
    private onServerError;
    /**
     * handle message from signalling server during connection handshake
     * @param {Event} event
     * @returns
     */
    private onServerMessage;
}
