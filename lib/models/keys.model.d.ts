export declare enum EventCode {
    MouseWheel = 0,
    MouseMove = 1,
    MouseUp = 2,
    MouseDown = 3,
    KeyUp = 4,
    KeyDown = 5,
    KeyPress = 6,
    KeyReset = 7,
    RelativeMouseOff = 8,
    RelativeMouseOn = 9
}
export declare enum ShortcutCode {
    Fullscreen = 0,
    PointerLock = 1
}
export declare enum KeyCode {
    Shift = 0,
    Alt = 1,
    Ctrl = 2,
    F = "KeyF",
    P = "KeyP"
}
export declare class Shortcut {
    code: ShortcutCode;
    keys: Array<KeyCode>;
    Handler: ((a: void) => (void));
    constructor(code: ShortcutCode, keys: Array<KeyCode>, Handler: ((a: void) => (void)));
    HandleShortcut(event: KeyboardEvent): Boolean;
}
export declare class HIDMsg {
    code: EventCode;
    data: Map<string, string>;
    constructor(code: EventCode, data: any);
    ToString(): string;
}
