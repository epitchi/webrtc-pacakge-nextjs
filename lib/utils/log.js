"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogConnectionEvent = exports.Log = exports.AddNotifier = exports.ConnectionEvent = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Debug"] = 0] = "Debug";
    LogLevel[LogLevel["Infor"] = 1] = "Infor";
    LogLevel[LogLevel["Warning"] = 2] = "Warning";
    LogLevel[LogLevel["Error"] = 3] = "Error";
    LogLevel[LogLevel["Fatal"] = 4] = "Fatal";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
function GetLogLevelString(level) {
    switch (level) {
        case LogLevel.Debug:
            return "Debug";
        case LogLevel.Infor:
            return "Infor";
        case LogLevel.Warning:
            return "Warning";
        case LogLevel.Error:
            return "Error";
        case LogLevel.Fatal:
            return "Fatal";
    }
}
var ConnectionEvent;
(function (ConnectionEvent) {
    ConnectionEvent[ConnectionEvent["ApplicationStarted"] = 0] = "ApplicationStarted";
    ConnectionEvent[ConnectionEvent["WebSocketConnecting"] = 1] = "WebSocketConnecting";
    ConnectionEvent[ConnectionEvent["WebSocketConnected"] = 2] = "WebSocketConnected";
    ConnectionEvent[ConnectionEvent["WebSocketDisconnected"] = 3] = "WebSocketDisconnected";
    ConnectionEvent[ConnectionEvent["WaitingAvailableDevice"] = 4] = "WaitingAvailableDevice";
    ConnectionEvent[ConnectionEvent["WaitingAvailableDeviceSelection"] = 5] = "WaitingAvailableDeviceSelection";
    ConnectionEvent[ConnectionEvent["ExchangingSignalingMessage"] = 6] = "ExchangingSignalingMessage";
    ConnectionEvent[ConnectionEvent["WebRTCConnectionChecking"] = 7] = "WebRTCConnectionChecking";
    ConnectionEvent[ConnectionEvent["WebRTCConnectionDoneChecking"] = 8] = "WebRTCConnectionDoneChecking";
    ConnectionEvent[ConnectionEvent["WebRTCConnectionClosed"] = 9] = "WebRTCConnectionClosed";
    ConnectionEvent[ConnectionEvent["ReceivedVideoStream"] = 10] = "ReceivedVideoStream";
    ConnectionEvent[ConnectionEvent["ReceivedAudioStream"] = 11] = "ReceivedAudioStream";
    ConnectionEvent[ConnectionEvent["ReceivedDatachannel"] = 12] = "ReceivedDatachannel";
})(ConnectionEvent = exports.ConnectionEvent || (exports.ConnectionEvent = {}));
function GetEventMessage(event) {
    switch (event) {
        case ConnectionEvent.ApplicationStarted:
            return "ApplicationStarted";
        case ConnectionEvent.WebSocketConnecting:
            return "WebSocketConnecting";
        case ConnectionEvent.WebSocketConnected:
            return "WebSocketConnected";
        case ConnectionEvent.WebSocketDisconnected:
            return "WebSocketDisconnected";
        case ConnectionEvent.WaitingAvailableDevice:
            return "WaitingAvailableDevice";
        case ConnectionEvent.WaitingAvailableDeviceSelection:
            return "WaitingAvailableDeviceSelection";
        case ConnectionEvent.ExchangingSignalingMessage:
            return "ExchangingSignalingMessage";
        case ConnectionEvent.WebRTCConnectionChecking:
            return "WebRTCConnectionChecking";
        case ConnectionEvent.WebRTCConnectionDoneChecking:
            return "WebRTCConnectionDoneChecking";
        case ConnectionEvent.ReceivedVideoStream:
            return "ReceivedVideoStream";
        case ConnectionEvent.ReceivedAudioStream:
            return "ReceivedAudioStream";
        case ConnectionEvent.ReceivedDatachannel:
            return "ReceivedDatachannel";
        case ConnectionEvent.WebRTCConnectionClosed:
            return "WebRTCConnectionClosed";
    }
}
class Logger {
    constructor() {
        this.logs = new Array();
        this.failNotifiers = new Array();
    }
    filterEvent(data) {
        this.logs.push(data);
    }
    BroadcastEvent(event) {
        this.failNotifiers.forEach(x => {
            x(GetEventMessage(event));
        });
    }
    AddNotifier(notifier) {
        this.failNotifiers.push(notifier);
    }
}
var init = false;
var loggerSingleton;
function getLoggerSingleton() {
    if (!init) {
        loggerSingleton = new Logger();
        init = true;
    }
    return loggerSingleton;
}
function AddNotifier(notifier) {
    let logger = getLoggerSingleton();
    logger.AddNotifier(notifier);
}
exports.AddNotifier = AddNotifier;
function Log(level, message) {
    let logger = getLoggerSingleton();
    logger.filterEvent(JSON.stringify(level));
    console.log(`[${GetLogLevelString(level)}] : ${message}`);
}
exports.Log = Log;
function LogConnectionEvent(a) {
    let logger = getLoggerSingleton();
    logger.BroadcastEvent(a);
    console.log(`[${GetLogLevelString(LogLevel.Infor)}] : ${GetEventMessage(a)}`);
}
exports.LogConnectionEvent = LogConnectionEvent;
