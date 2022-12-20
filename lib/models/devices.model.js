"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceSelectionResult = exports.DeviceSelection = exports.Monitor = exports.Soundcard = void 0;
var Soundcard = /** @class */ (function () {
    function Soundcard(data) {
        this.DeviceID = data.id;
        this.Name = data.name;
        this.Api = data.api;
        this.IsDefault = data.isDefault;
        this.IsLoopback = data.isLoopback;
        return this;
    }
    return Soundcard;
}());
exports.Soundcard = Soundcard;
var Monitor = /** @class */ (function () {
    function Monitor(data) {
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
    return Monitor;
}());
exports.Monitor = Monitor;
var DeviceSelection = /** @class */ (function () {
    function DeviceSelection(data) {
        this.monitors = new Array();
        this.soundcards = new Array();
        var parseResult = JSON.parse(data);
        for (var _i = 0, _a = parseResult["monitors"]; _i < _a.length; _i++) {
            var i = _a[_i];
            this.monitors.push(new Monitor(i));
        }
        for (var _b = 0, _c = parseResult["soundcards"]; _b < _c.length; _b++) {
            var i = _c[_b];
            this.soundcards.push(new Soundcard(i));
        }
    }
    return DeviceSelection;
}());
exports.DeviceSelection = DeviceSelection;
var DeviceSelectionResult = /** @class */ (function () {
    function DeviceSelectionResult(soundcard, monitor) {
        this.SoundcardDeviceID = soundcard;
        this.MonitorHandle = monitor;
    }
    DeviceSelectionResult.prototype.ToString = function () {
        return JSON.stringify({
            monitor: this.MonitorHandle,
            soundcard: this.SoundcardDeviceID,
        });
    };
    return DeviceSelectionResult;
}());
exports.DeviceSelectionResult = DeviceSelectionResult;
