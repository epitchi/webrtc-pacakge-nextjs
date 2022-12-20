export declare class DataChannel {
    HID: RTCDataChannel | null;
    constructor(chan: RTCDataChannel, handler: ((data: string) => (void)));
    sendMessage(message: string): void;
}
