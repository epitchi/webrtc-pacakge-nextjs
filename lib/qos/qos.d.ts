export declare class VideoMetrics {
    type: string;
    constructor();
    frameWidth: number;
    frameHeight: number;
    codecId: string;
    decoderImplementation: string;
    totalSquaredInterFrameDelay: number;
    totalInterFrameDelay: number;
    totalProcessingDelay: number;
    totalDecodeTime: number;
    keyFramesDecoded: number;
    framesDecoded: number;
    framesReceived: number;
    headerBytesReceived: number;
    bytesReceived: number;
    packetsReceived: number;
    framesDropped: number;
    packetsLost: number;
    jitterBufferEmittedCount: number;
    jitterBufferDelay: number;
    jitter: number;
    timestamp: number;
}
export declare class AudioMetrics {
    type: string;
    constructor();
    audioLevel: number;
    totalAudioEnergy: number;
    totalSamplesReceived: number;
    headerBytesReceived: number;
    bytesReceived: number;
    packetsReceived: number;
    packetsLost: number;
    timestamp: number;
}
export declare class NetworkMetrics {
    type: string;
    constructor();
    packetsReceived: number;
    packetsSent: number;
    bytesSent: number;
    bytesReceived: number;
    availableIncomingBitrate: number;
    availableOutgoingBitrate: number;
    currentRoundTripTime: number;
    totalRoundTripTime: number;
    localIP: string;
    localPort: number;
    remoteIP: string;
    remotePort: number;
    priority: number;
    timestamp: number;
}
export declare class Adaptive {
    constructor(conn: RTCPeerConnection, metricCallback: (data: string) => void);
    metricCallback: (data: string) => void;
    conn: RTCPeerConnection;
    running: boolean;
    filterNetwork(report: RTCStatsReport): NetworkMetrics | null;
    filterVideo(report: RTCStatsReport): VideoMetrics | null;
    filterAudio(report: RTCStatsReport): AudioMetrics | null;
    getConnectionStats(conn: RTCPeerConnection): Promise<void>;
    /**
     *
     */
    startCollectingStat(conn: RTCPeerConnection): void;
}
