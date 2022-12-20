"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HIDMsg = exports.Shortcut = exports.KeyCode = exports.ShortcutCode = exports.EventCode = void 0;
var log_1 = require("../utils/log");
var EventCode;
(function (EventCode) {
    EventCode[EventCode["MouseWheel"] = 0] = "MouseWheel";
    EventCode[EventCode["MouseMove"] = 1] = "MouseMove";
    EventCode[EventCode["MouseUp"] = 2] = "MouseUp";
    EventCode[EventCode["MouseDown"] = 3] = "MouseDown";
    EventCode[EventCode["KeyUp"] = 4] = "KeyUp";
    EventCode[EventCode["KeyDown"] = 5] = "KeyDown";
    EventCode[EventCode["KeyPress"] = 6] = "KeyPress";
    EventCode[EventCode["KeyReset"] = 7] = "KeyReset";
    EventCode[EventCode["RelativeMouseOff"] = 8] = "RelativeMouseOff";
    EventCode[EventCode["RelativeMouseOn"] = 9] = "RelativeMouseOn";
})(EventCode = exports.EventCode || (exports.EventCode = {}));
var ShortcutCode;
(function (ShortcutCode) {
    ShortcutCode[ShortcutCode["Fullscreen"] = 0] = "Fullscreen";
    ShortcutCode[ShortcutCode["PointerLock"] = 1] = "PointerLock";
})(ShortcutCode = exports.ShortcutCode || (exports.ShortcutCode = {}));
var KeyCode;
(function (KeyCode) {
    KeyCode[KeyCode["Shift"] = 0] = "Shift";
    KeyCode[KeyCode["Alt"] = 1] = "Alt";
    KeyCode[KeyCode["Ctrl"] = 2] = "Ctrl";
    KeyCode["F"] = "KeyF";
    KeyCode["P"] = "KeyP";
})(KeyCode = exports.KeyCode || (exports.KeyCode = {}));
var Shortcut = /** @class */ (function () {
    function Shortcut(code, keys, Handler) {
        this.code = code;
        this.keys = keys;
        this.Handler = Handler;
    }
    Shortcut.prototype.HandleShortcut = function (event) {
        var shift = this.keys.includes(KeyCode.Shift) === event.shiftKey;
        var alt = this.keys.includes(KeyCode.Alt) === event.altKey;
        var ctrl = this.keys.includes(KeyCode.Ctrl) === event.ctrlKey;
        var key = false;
        this.keys.forEach(function (element) {
            if (element === event.code) {
                key = true;
            }
        });
        if (shift && alt && ctrl && key) {
            event.preventDefault();
            (0, log_1.Log)(log_1.LogLevel.Infor, "shortcut fired with code ".concat(this.code));
            this.Handler();
            return true;
        }
        return false;
    };
    return Shortcut;
}());
exports.Shortcut = Shortcut;
var HIDMsg = /** @class */ (function () {
    function HIDMsg(code, data) {
        this.code = code;
        this.data = new Map();
        Object.keys(data).forEach(function (key) {
            this.data.set(key, data[key]);
        }.bind(this));
    }
    HIDMsg.prototype.ToString = function () {
        var data = {};
        this.data.forEach(function (value, key) {
            data[key] = value;
        });
        return JSON.stringify({
            code: this.code,
            data: data,
        });
    };
    return HIDMsg;
}());
exports.HIDMsg = HIDMsg;
