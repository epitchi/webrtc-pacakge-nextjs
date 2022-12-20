"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HID = void 0;
const log_1 = require("../utils/log");
const keys_model_1 = require("../models/keys.model");
const keys_model_2 = require("../models/keys.model");
class HID {
    constructor(videoElement, Sendfunc) {
        this.relativeMouse = false;
        this.video = videoElement;
        this.SendFunc = Sendfunc;
        this.Screen = {
            StreamHeight: 0,
            StreamWidth: 0,
            ClientHeight: 0,
            ClientWidth: 0,
            ClientLeft: 0,
            ClientTop: 0,
        };
        var VideoElement;
        VideoElement = this.video.current;
        /**
         * video event
         */
        VideoElement.addEventListener('contextmenu', ((event) => { event.preventDefault(); })); ///disable content menu key on remote control
        /**
         * mouse event
         */
        VideoElement.addEventListener('wheel', this.mouseWheel.bind(this));
        VideoElement.addEventListener('mousemove', this.mouseButtonMovement.bind(this));
        VideoElement.addEventListener('mousedown', this.mouseButtonDown.bind(this));
        VideoElement.addEventListener('mouseup', this.mouseButtonUp.bind(this));
        /**
         * keyboard event
         */
        window.addEventListener('keydown', this.keydown.bind(this));
        window.addEventListener('keyup', this.keyup.bind(this));
        /**
         * mouse lock event
         */
        VideoElement.addEventListener('mouseleave', this.mouseLeaveEvent.bind(this));
        VideoElement.addEventListener('mouseenter', this.mouseEnterEvent.bind(this));
        document.addEventListener('pointerlockchange', this.pointerLock.bind(this));
        this.shortcuts = new Array();
        this.shortcuts.push(new keys_model_2.Shortcut(keys_model_2.ShortcutCode.Fullscreen, [keys_model_2.KeyCode.Ctrl, keys_model_2.KeyCode.Shift, keys_model_2.KeyCode.F], (() => {
            this.video.current.parentElement.requestFullscreen();
        })));
        this.shortcuts.push(new keys_model_2.Shortcut(keys_model_2.ShortcutCode.PointerLock, [keys_model_2.KeyCode.Ctrl, keys_model_2.KeyCode.Shift, keys_model_2.KeyCode.P], (() => {
            if (!document.pointerLockElement) {
                this.relativeMouse = true;
                this.SendFunc((new keys_model_2.HIDMsg(keys_model_1.EventCode.RelativeMouseOn, {}).ToString()));
                this.video.current.requestPointerLock();
            }
            else {
                this.relativeMouse = false;
                this.SendFunc((new keys_model_2.HIDMsg(keys_model_1.EventCode.RelativeMouseOff, {}).ToString()));
                document.exitPointerLock();
            }
        })));
    }
    mouseEnterEvent(event) {
        (0, log_1.Log)(log_1.LogLevel.Debug, "Mouse enter");
        this.SendFunc((new keys_model_2.HIDMsg(keys_model_1.EventCode.KeyReset, {}).ToString()));
    }
    mouseLeaveEvent(event) {
        (0, log_1.Log)(log_1.LogLevel.Debug, "Mouse leave");
        this.SendFunc((new keys_model_2.HIDMsg(keys_model_1.EventCode.KeyReset, {}).ToString()));
    }
    pointerLock(event) {
        (0, log_1.Log)(log_1.LogLevel.Infor, "toggle pointer lock");
    }
    keydown(event) {
        event.preventDefault();
        let disable_send = false;
        this.shortcuts.forEach((element) => {
            let triggered = element.HandleShortcut(event);
            if (triggered)
                disable_send = true;
        });
        if (disable_send)
            return;
        let jsKey = event.key;
        let code = keys_model_1.EventCode.KeyDown;
        this.SendFunc((new keys_model_2.HIDMsg(code, {
            key: jsKey,
        })).ToString());
    }
    keyup(event) {
        let jsKey = event.key;
        let code = keys_model_1.EventCode.KeyUp;
        this.SendFunc((new keys_model_2.HIDMsg(code, {
            key: jsKey,
        })).ToString());
        event.preventDefault();
    }
    mouseWheel(event) {
        let wheelY = event.deltaY;
        let wheelX = event.deltaX;
        let code = keys_model_1.EventCode.MouseWheel;
        this.SendFunc((new keys_model_2.HIDMsg(code, {
            deltaY: wheelY,
        })).ToString());
    }
    mouseButtonMovement(event) {
        this.elementConfig(this.video.current);
        let code = keys_model_1.EventCode.MouseMove;
        if (!this.relativeMouse) {
            let mousePosition_X = this.clientToServerX(event.clientX);
            let mousePosition_Y = this.clientToServerY(event.clientY);
            this.SendFunc((new keys_model_2.HIDMsg(code, {
                dX: mousePosition_X,
                dY: mousePosition_Y,
            })).ToString());
        }
        else {
            this.SendFunc((new keys_model_2.HIDMsg(code, {
                dX: event.movementX,
                dY: event.movementY,
            })).ToString());
        }
    }
    mouseButtonDown(event) {
        let code = keys_model_1.EventCode.MouseDown;
        this.SendFunc((new keys_model_2.HIDMsg(code, {
            button: event.button
        })).ToString());
    }
    mouseButtonUp(event) {
        let code = keys_model_1.EventCode.MouseUp;
        this.SendFunc((new keys_model_2.HIDMsg(code, {
            button: event.button
        })).ToString());
    }
    clientToServerY(clientY) {
        return (clientY - this.Screen.ClientTop) / this.Screen.ClientHeight;
    }
    clientToServerX(clientX) {
        return (clientX - this.Screen.ClientLeft) / this.Screen.ClientWidth;
    }
    elementConfig(VideoElement) {
        this.Screen.ClientWidth = VideoElement.offsetWidth;
        this.Screen.ClientHeight = VideoElement.offsetHeight;
        this.Screen.ClientTop = VideoElement.offsetTop;
        this.Screen.ClientLeft = VideoElement.offsetLeft;
        this.Screen.StreamHeight = VideoElement.videoHeight;
        this.Screen.StreamWidth = VideoElement.videoWidth;
    }
}
exports.HID = HID;
