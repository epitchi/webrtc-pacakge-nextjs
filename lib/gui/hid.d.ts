export declare class HID {
    private shortcuts;
    private relativeMouse;
    private Screen;
    private video;
    private SendFunc;
    constructor(videoElement: any, Sendfunc: ((data: string) => (void)));
    mouseEnterEvent(event: MouseEvent): void;
    mouseLeaveEvent(event: MouseEvent): void;
    pointerLock(event: Event): void;
    keydown(event: KeyboardEvent): void;
    keyup(event: KeyboardEvent): void;
    mouseWheel(event: WheelEvent): void;
    mouseButtonMovement(event: MouseEvent): void;
    mouseButtonDown(event: MouseEvent): void;
    mouseButtonUp(event: MouseEvent): void;
    clientToServerY(clientY: number): number;
    clientToServerX(clientX: number): number;
    elementConfig(VideoElement: HTMLVideoElement): void;
}
