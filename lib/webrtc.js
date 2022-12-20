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
exports.WebRTC = void 0;
const log_1 = require("./utils/log");
const qos_1 = require("./qos/qos");
class WebRTC {
    constructor(sendFunc, TrackHandler, channelHandler, metricHandler) {
        this.State = "Not setted up";
        this.SignalingSendFunc = sendFunc;
        this.MetricHandler = metricHandler;
        this.TrackHandler = TrackHandler;
        this.channelHandler = channelHandler;
        this.Conn = null;
        this.Ads = null;
    }
    SetupConnection(config) {
        this.Conn = new RTCPeerConnection(config);
        this.Ads = new qos_1.Adaptive(this.Conn, this.MetricHandler);
        this.Conn.ondatachannel = this.channelHandler.bind(this);
        this.Conn.ontrack = this.TrackHandler.bind(this);
        this.Conn.onicecandidate = this.onICECandidates.bind(this);
        this.Conn.onconnectionstatechange = this.onConnectionStateChange.bind(this);
        this.State = "Not connected";
    }
    onConnectionStateChange(eve) {
        console.log(`state change to ${JSON.stringify(eve)}`);
        switch (eve.type) {
            case "connected":
                (0, log_1.LogConnectionEvent)(log_1.ConnectionEvent.WebRTCConnectionDoneChecking);
                (0, log_1.Log)(log_1.LogLevel.Infor, "webrtc connection established");
                break;
            case "failed":
                (0, log_1.LogConnectionEvent)(log_1.ConnectionEvent.WebRTCConnectionClosed);
                (0, log_1.Log)(log_1.LogLevel.Error, "webrtc connection establish failed");
                break;
            case "closed":
                (0, log_1.LogConnectionEvent)(log_1.ConnectionEvent.WebRTCConnectionClosed);
                (0, log_1.Log)(log_1.LogLevel.Error, "webrtc connection establish failed");
                break;
            default:
                break;
        }
    }
    /**
     *
     * @param {*} ice
     */
    onIncomingICE(ice) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            var candidate = new RTCIceCandidate(ice);
            try {
                yield ((_a = this.Conn) === null || _a === void 0 ? void 0 : _a.addIceCandidate(candidate));
            }
            catch (error) {
                (0, log_1.Log)(log_1.LogLevel.Error, "iCE error");
            }
            ;
        });
    }
    /**
     * Handles incoming SDP from signalling server.
     * Sets the remote description on the peer connection,
     * creates an answer with a local description and sends that to the peer.
     *
     * @param {RTCSessionDescriptionInit} sdp
     */
    onIncomingSDP(sdp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (sdp.type != "offer")
                return;
            this.State = "Got SDP offer";
            try {
                var Conn = this.Conn ? this.Conn : null;
                if (Conn == null) {
                    return;
                }
                yield Conn.setRemoteDescription(sdp);
                var ans = yield Conn.createAnswer();
                yield this.onLocalDescription(ans);
            }
            catch (error) {
                (0, log_1.Log)(log_1.LogLevel.Error, "SDP error");
            }
            ;
        });
    }
    /**
     * Handles local description creation from createAnswer.
     *
     * @param {RTCSessionDescriptionInit} local_sdp
     */
    onLocalDescription(desc) {
        return __awaiter(this, void 0, void 0, function* () {
            var Conn = this.Conn;
            if (Conn == null) {
                return;
            }
            yield Conn.setLocalDescription(desc);
            if (!Conn.localDescription)
                return;
            var init = Conn.localDescription;
            var dat = new Map();
            dat.set("Type", init.type);
            dat.set("SDP", init.sdp);
            this.SignalingSendFunc("SDP", dat);
        });
    }
    onICECandidates(event) {
        if (event.candidate == null) {
            console.log("ICE Candidate was null, done");
            return;
        }
        var init = event.candidate.toJSON();
        var dat = new Map();
        if (init.candidate)
            dat.set("Candidate", init.candidate);
        if (init.sdpMid)
            dat.set("SDPMid", init.sdpMid);
        if (init.sdpMLineIndex)
            dat.set("SDPMLineIndex", init.sdpMLineIndex.toString());
        this.SignalingSendFunc("ICE", dat);
    }
}
exports.WebRTC = WebRTC;
