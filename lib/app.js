"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebRTCClient = void 0;
const datachannel_1 = require("./datachannel/datachannel");
const hid_1 = require("./gui/hid");
const log_1 = require("./utils/log");
const devices_model_1 = require("./models/devices.model");
const webrtc_1 = require("./webrtc");
const websocket_1 = require("./signaling/websocket");
class WebRTCClient {
    constructor(signalingURL, vid, audio, token, DeviceSelection) {
        (0, log_1.Log)(log_1.LogLevel.Infor, `Started oneplay app connect to signaling server ${signalingURL}`);
        (0, log_1.Log)(log_1.LogLevel.Infor, `Session token: ${token}`);
        (0, log_1.LogConnectionEvent)(log_1.ConnectionEvent.ApplicationStarted);
        this.started = false;
        this.video = vid;
        this.audio = audio;
        this.alert = () => { };
        this.DeviceSelection = DeviceSelection;
        this.datachannels = new Map();
        this.hid = new hid_1.HID(this.video, (data) => {
            let channel = this.datachannels.get("hid");
            if (channel == null) {
                (0, log_1.Log)(log_1.LogLevel.Warning, "attempting to send message while data channel is not established");
                return;
            }
            channel.sendMessage(data);
        });
        this.signaling = new websocket_1.SignallingClient(signalingURL, token, this.handleIncomingPacket.bind(this));
        this.webrtc = new webrtc_1.WebRTC(this.signaling.SignallingSend.bind(this.signaling), this.handleIncomingTrack.bind(this), this.handleIncomingDataChannel.bind(this), this.handleWebRTCMetric.bind(this));
    }
    handleIncomingTrack(evt) {
        this.started = true;
        (0, log_1.Log)(log_1.LogLevel.Infor, `Incoming ${evt.track.kind} stream`);
        if (evt.track.kind == "audio") {
            if (this.audio.current.srcObject !== evt.streams[0]) {
                (0, log_1.LogConnectionEvent)(log_1.ConnectionEvent.ReceivedAudioStream);
                this.audio.current.srcObject = evt.streams[0];
            }
        }
        else if (evt.track.kind == "video") {
            if (this.video.current.srcObject !== evt.streams[0]) {
                (0, log_1.LogConnectionEvent)(log_1.ConnectionEvent.ReceivedVideoStream);
                this.video.current.srcObject = evt.streams[0];
            }
        }
    }
    handleWebRTCMetric(a) {
        (0, log_1.Log)(log_1.LogLevel.Infor, `metric : ${a}`);
        const dcName = "adaptive";
        let channel = this.datachannels.get(dcName);
        if (channel == null) {
            (0, log_1.Log)(log_1.LogLevel.Warning, `attempting to send message while data channel ${dcName} is ready`);
            return;
        }
        channel.sendMessage(a);
    }
    handleIncomingDataChannel(a) {
        (0, log_1.LogConnectionEvent)(log_1.ConnectionEvent.ReceivedDatachannel);
        (0, log_1.Log)(log_1.LogLevel.Infor, `incoming data channel: ${a.channel.label}`);
        if (!a.channel)
            return;
        this.datachannels.set(a.channel.label, new datachannel_1.DataChannel(a.channel, (data) => {
            (0, log_1.Log)(log_1.LogLevel.Debug, `message from data channel ${a.channel.label}: ${data}`);
        }));
    }
    handleIncomingPacket(pkt) {
        return __awaiter(this, void 0, void 0, function* () {
            var target = pkt.get("Target");
            if (target == "SDP") {
                var sdp = pkt.get("SDP");
                if (sdp === undefined) {
                    (0, log_1.Log)(log_1.LogLevel.Error, "missing sdp");
                    return;
                }
                var type = pkt.get("Type");
                if (type == undefined) {
                    (0, log_1.Log)(log_1.LogLevel.Error, "missing sdp type");
                    return;
                }
                this.webrtc.onIncomingSDP({
                    sdp: sdp,
                    type: (type == "offer") ? "offer" : "answer"
                });
            }
            else if (target == "ICE") {
                var sdpmid = pkt.get("SDPMid");
                if (sdpmid == undefined) {
                    (0, log_1.Log)(log_1.LogLevel.Error, "Missing sdp mid field");
                }
                var lineidx = pkt.get("SDPMLineIndex");
                if (lineidx === undefined) {
                    (0, log_1.Log)(log_1.LogLevel.Error, "Missing sdp line index field");
                    return;
                }
                var can = pkt.get("Candidate");
                if (can == undefined) {
                    (0, log_1.Log)(log_1.LogLevel.Error, "Missing sdp candidate field");
                    return;
                }
                this.webrtc.onIncomingICE({
                    candidate: can,
                    sdpMid: sdpmid,
                    sdpMLineIndex: Number.parseInt(lineidx)
                });
            }
            else if (target == "PREFLIGHT") { //TODO
                let preverro = pkt.get("Error");
                if (preverro != null) {
                    (0, log_1.Log)(log_1.LogLevel.Error, preverro);
                    this.alert(preverro);
                }
                let webrtcConf = pkt.get("WebRTCConfig");
                if (webrtcConf != null) {
                    let config = JSON.parse(webrtcConf);
                    this.webrtc.SetupConnection(config);
                }
                let x = pkt.get("Devices");
                if (x == null) {
                    return;
                }
                let i = new devices_model_1.DeviceSelection(x);
                let result = yield this.DeviceSelection(i);
                var dat = new Map();
                dat.set("type", "answer");
                dat.set("monitor", result.MonitorHandle);
                dat.set("soundcard", result.SoundcardDeviceID);
                this.signaling.SignallingSend("PREFLIGHT", dat);
            }
            else if (target == "START") {
                var dat = new Map();
                this.signaling.SignallingSend("START", dat);
            }
        });
    }
    Notifier(notifier) {
        (0, log_1.AddNotifier)(notifier);
        return this;
    }
    Alert(notifier) {
        this.alert = notifier;
        return this;
    }
    ChangeFramerate(framerate) {
        const dcName = "manual";
        let channel = this.datachannels.get(dcName);
        if (channel == null) {
            (0, log_1.Log)(log_1.LogLevel.Warning, `attempting to send message while data channel ${dcName} is ready`);
            return;
        }
        channel.sendMessage(JSON.stringify({
            type: "framerate",
            framerate: framerate
        }));
    }
    ChangeBitrate(bitrate) {
        const dcName = "manual";
        let channel = this.datachannels.get(dcName);
        if (channel == null) {
            (0, log_1.Log)(log_1.LogLevel.Warning, `attempting to send message while data channel ${dcName} is ready`);
            return;
        }
        channel.sendMessage(JSON.stringify({
            type: "bitrate",
            bitrate: bitrate
        }));
    }
}
exports.WebRTCClient = WebRTCClient;
