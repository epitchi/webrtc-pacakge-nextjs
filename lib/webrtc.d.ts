import { Adaptive } from "./qos/qos";
export declare class WebRTC {
    State: string;
    Conn: RTCPeerConnection;
    Ads: Adaptive;
    private SignalingSendFunc;
    private MetricHandler;
    private TrackHandler;
    private channelHandler;
    constructor(sendFunc: (Target: string, Data: Map<string, string>) => (void), TrackHandler: (a: RTCTrackEvent) => (any), channelHandler: (a: RTCDataChannelEvent) => (any), metricHandler: (a: string) => (void));
    SetupConnection(config: RTCConfiguration): void;
    private onConnectionStateChange;
    /**
     *
     * @param {*} ice
     */
    onIncomingICE(ice: RTCIceCandidateInit): Promise<void>;
    /**
     * Handles incoming SDP from signalling server.
     * Sets the remote description on the peer connection,
     * creates an answer with a local description and sends that to the peer.
     *
     * @param {RTCSessionDescriptionInit} sdp
     */
    onIncomingSDP(sdp: RTCSessionDescriptionInit): Promise<void>;
    /**
     * Handles local description creation from createAnswer.
     *
     * @param {RTCSessionDescriptionInit} local_sdp
     */
    private onLocalDescription;
    private onICECandidates;
}
