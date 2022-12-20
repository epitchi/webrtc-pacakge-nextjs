export declare class Soundcard {
    DeviceID: string;
    Name: string;
    Api: string;
    IsDefault: boolean;
    IsLoopback: boolean;
    constructor(data: any);
}
export declare class Monitor {
    MonitorHandle: number;
    MonitorName: string;
    DeviceName: string;
    Adapter: string;
    Width: number;
    Height: number;
    Framerate: number;
    IsPrimary: boolean;
    constructor(data: any);
}
export declare class DeviceSelection {
    monitors: Array<Monitor>;
    soundcards: Array<Soundcard>;
    constructor(data: string);
}
export declare class DeviceSelectionResult {
    MonitorHandle: string;
    SoundcardDeviceID: string;
    constructor(soundcard: string, monitor: string);
    ToString(): string;
}
