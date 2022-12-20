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
exports.Adaptive = exports.NetworkMetrics = exports.AudioMetrics = exports.VideoMetrics = void 0;
class VideoMetrics {
    constructor() {
        this.type = "video";
        this.frameWidth = 0;
        this.frameHeight = 0;
        this.codecId = "";
        this.decoderImplementation = "";
        this.totalSquaredInterFrameDelay = 0;
        this.totalInterFrameDelay = 0;
        this.totalProcessingDelay = 0;
        this.totalDecodeTime = 0;
        this.keyFramesDecoded = 0;
        this.framesDecoded = 0;
        this.framesReceived = 0;
        this.headerBytesReceived = 0;
        this.bytesReceived = 0;
        this.packetsReceived = 0;
        this.framesDropped = 0;
        this.packetsLost = 0;
        this.jitterBufferEmittedCount = 0;
        this.jitterBufferDelay = 0;
        this.jitter = 0;
        this.timestamp = 0;
    }
}
exports.VideoMetrics = VideoMetrics;
class AudioMetrics {
    constructor() {
        this.type = "audio";
        this.audioLevel = 0;
        this.totalAudioEnergy = 0;
        this.totalSamplesReceived = 0;
        this.headerBytesReceived = 0;
        this.bytesReceived = 0;
        this.packetsReceived = 0;
        this.packetsLost = 0;
        this.timestamp = 0;
    }
}
exports.AudioMetrics = AudioMetrics;
class NetworkMetrics {
    constructor() {
        this.type = "network";
        this.packetsReceived = 0;
        this.packetsSent = 0;
        this.bytesSent = 0;
        this.bytesReceived = 0;
        this.availableIncomingBitrate = 0;
        this.availableOutgoingBitrate = 0;
        this.currentRoundTripTime = 0;
        this.totalRoundTripTime = 0;
        this.localIP = "";
        this.localPort = 0;
        this.remoteIP = "";
        this.remotePort = 0;
        this.priority = 0;
        this.timestamp = 0;
    }
}
exports.NetworkMetrics = NetworkMetrics;
class Adaptive {
    constructor(conn, metricCallback) {
        this.conn = conn;
        this.running = true;
        this.metricCallback = metricCallback;
        this.startCollectingStat(this.conn);
    }
    filterNetwork(report) {
        let remoteCandidate = "";
        let localCandidate = "";
        let CandidatePair = "";
        report.forEach((value, key) => {
            if (value["type"] == "candidate-pair" &&
                value["state"] == "succeeded" &&
                value["writable"] == true) {
                remoteCandidate = value["remoteCandidateId"];
                localCandidate = value["localCandidateId"];
                CandidatePair = key;
            }
        });
        if (CandidatePair == "") {
            return null;
        }
        let val = report.get(CandidatePair);
        let ret = new NetworkMetrics();
        ret.localIP = report.get(localCandidate)["ip"];
        ret.remoteIP = report.get(remoteCandidate)["ip"];
        ret.localPort = report.get(localCandidate)["port"];
        ret.remotePort = report.get(remoteCandidate)["port"];
        ret.packetsReceived = val["packetsReceived"];
        ret.packetsSent = val["packetsSent"];
        ret.bytesSent = val["bytesSent"];
        ret.bytesReceived = val["bytesReceived"];
        ret.availableIncomingBitrate = val["availableIncomingBitrate"];
        ret.availableOutgoingBitrate = val["availableOutgoingBitrate"];
        ret.currentRoundTripTime = val["currentRoundTripTime"];
        ret.totalRoundTripTime = val["totalRoundTripTime"];
        ret.priority = val["priority"];
        ret.timestamp = val["timestamp"];
        return ret;
    }
    filterVideo(report) {
        let ret = null;
        report.forEach((val, key) => {
            if (val["type"] == "inbound-rtp" &&
                val["kind"] == "video") {
                ret = new VideoMetrics();
                ret.frameWidth = val["frameWidth"];
                ret.frameHeight = val["frameHeight"];
                ret.codecId = val["codecId"];
                ret.decoderImplementation = val["decoderImplementation"];
                ret.totalSquaredInterFrameDelay = val["totalSquaredInterFrameDelay"];
                ret.totalInterFrameDelay = val["totalInterFrameDelay"];
                ret.totalProcessingDelay = val["totalProcessingDelay"];
                ret.totalDecodeTime = val["totalDecodeTime"];
                ret.keyFramesDecoded = val["keyFramesDecoded"];
                ret.framesDecoded = val["framesDecoded"];
                ret.framesReceived = val["framesReceived"];
                ret.headerBytesReceived = val["headerBytesReceived"];
                ret.bytesReceived = val["bytesReceived"];
                ret.packetsReceived = val["packetsReceived"];
                ret.framesDropped = val["framesDropped"];
                ret.packetsLost = val["packetsLost"];
                ret.jitterBufferEmittedCount = val["jitterBufferEmittedCount"];
                ret.jitterBufferDelay = val["jitterBufferDelay"];
                ret.jitter = val["jitter"];
                ret.timestamp = val["timestamp"];
            }
        });
        return ret;
    }
    filterAudio(report) {
        let ret = null;
        report.forEach((val, key) => {
            if (val["type"] == "inbound-rtp" &&
                val["kind"] == "audio") {
                ret = new AudioMetrics();
                ret.totalAudioEnergy = val["totalAudioEnergy"];
                ret.totalSamplesReceived = val["totalSamplesReceived"];
                ret.headerBytesReceived = val["headerBytesReceived"];
                ret.bytesReceived = val["bytesReceived"];
                ret.packetsReceived = val["packetsReceived"];
                ret.packetsLost = val["packetsLost"];
                ret.timestamp = val["timestamp"];
            }
        });
        return ret;
    }
    getConnectionStats(conn) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield conn.getStats();
            let network = this.filterNetwork(result);
            if (network != null) {
                this.metricCallback(JSON.stringify(network));
            }
            let audio = this.filterAudio(result);
            if (audio != null) {
                this.metricCallback(JSON.stringify(audio));
            }
            let video = this.filterVideo(result);
            if (video != null) {
                this.metricCallback(JSON.stringify(video));
            }
        });
    }
    /**
     *
     */
    startCollectingStat(conn) {
        var statsLoop = () => __awaiter(this, void 0, void 0, function* () {
            yield this.getConnectionStats(conn);
            setTimeout(statsLoop, 1000);
        });
        statsLoop();
    }
}
exports.Adaptive = Adaptive;
