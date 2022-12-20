"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceSelectionResult = exports.DeviceSelection = exports.Monitor = exports.Soundcard = void 0;
class Soundcard {
    constructor(data) {
        this.DeviceID = data.id;
        this.Name = data.name;
        this.Api = data.api;
        this.IsDefault = data.isDefault;
        this.IsLoopback = data.isLoopback;
        return this;
    }
}
exports.Soundcard = Soundcard;
class Monitor {
    constructor(data) {
        this.MonitorHandle = data.handle;
        this.MonitorName = data.name;
        this.DeviceName = data.device;
        this.Adapter = data.adapter;
        this.Width = data.width;
        this.Height = data.height;
        this.Framerate = data.framerate;
        this.IsPrimary = data.isPrimary;
        return this;
    }
}
exports.Monitor = Monitor;
class DeviceSelection {
    constructor(data) {
        this.monitors = new Array();
        this.soundcards = new Array();
        let parseResult = JSON.parse(data);
        for (var i of parseResult["monitors"]) {
            this.monitors.push(new Monitor(i));
        }
        for (var i of parseResult["soundcards"]) {
            this.soundcards.push(new Soundcard(i));
        }
    }
}
exports.DeviceSelection = DeviceSelection;
class DeviceSelectionResult {
    constructor(soundcard, monitor) {
        this.SoundcardDeviceID = soundcard;
        this.MonitorHandle = monitor;
    }
    ToString() {
        return JSON.stringify({
            monitor: this.MonitorHandle,
            soundcard: this.SoundcardDeviceID,
        });
    }
}
exports.DeviceSelectionResult = DeviceSelectionResult;
