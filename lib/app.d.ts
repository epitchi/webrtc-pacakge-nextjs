import { DataChannel } from "./datachannel/datachannel";
import { HID } from "./gui/hid";
import { DeviceSelection, DeviceSelectionResult } from "./models/devices.model";
import { WebRTC } from "./webrtc";
import { SignallingClient } from "./signaling/websocket";
export declare class WebRTCClient {
    video: any;
    audio: any;
    webrtc: WebRTC;
    hid: HID;
    signaling: SignallingClient;
    datachannels: Map<string, DataChannel>;
    DeviceSelection: (input: DeviceSelection) => Promise<DeviceSelectionResult>;
    alert: (input: string) => (void);
    started: boolean;
    constructor(signalingURL: string, vid: any, audio: any, token: string, DeviceSelection: (n: DeviceSelection) => Promise<DeviceSelectionResult>);
    private handleIncomingTrack;
    private handleWebRTCMetric;
    private handleIncomingDataChannel;
    private handleIncomingPacket;
    Notifier(notifier: (message: string) => (void)): WebRTCClient;
    Alert(notifier: (message: string) => (void)): WebRTCClient;
    ChangeFramerate(framerate: number): void;
    ChangeBitrate(bitrate: number): void;
}
