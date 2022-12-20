export declare enum LogLevel {
    Debug = 0,
    Infor = 1,
    Warning = 2,
    Error = 3,
    Fatal = 4
}
export declare enum ConnectionEvent {
    ApplicationStarted = 0,
    WebSocketConnecting = 1,
    WebSocketConnected = 2,
    WebSocketDisconnected = 3,
    WaitingAvailableDevice = 4,
    WaitingAvailableDeviceSelection = 5,
    ExchangingSignalingMessage = 6,
    WebRTCConnectionChecking = 7,
    WebRTCConnectionDoneChecking = 8,
    WebRTCConnectionClosed = 9,
    ReceivedVideoStream = 10,
    ReceivedAudioStream = 11,
    ReceivedDatachannel = 12
}
export declare function AddNotifier(notifier: (message: string) => (void)): void;
export declare function Log(level: LogLevel, message: string): void;
export declare function LogConnectionEvent(a: ConnectionEvent): void;
