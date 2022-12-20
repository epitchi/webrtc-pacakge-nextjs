"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataChannel = void 0;
class DataChannel {
    constructor(chan, handler) {
        this.HID = chan;
        this.HID.onmessage = ((ev) => {
            var _a;
            if (ev.data === "ping") {
                (_a = this.HID) === null || _a === void 0 ? void 0 : _a.send("ping");
                return;
            }
            handler(ev.data);
        });
        this.HID.onerror = (() => {
        });
        this.HID.onclose = (() => {
        });
    }
    sendMessage(message) {
        if (this.HID == null) {
            return;
        }
        this.HID.send(message);
    }
}
exports.DataChannel = DataChannel;
