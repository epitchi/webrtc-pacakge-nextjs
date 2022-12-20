"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRequest = exports.UserResponse = void 0;
var UserResponse = /** @class */ (function () {
    function UserResponse(id, error, data) {
        this.Id = id;
        this.Error = error;
        var Data = new Map();
        Object.keys(data).forEach(function (key) {
            Data.set(key, data[key]);
        });
        this.Data = Data;
    }
    UserResponse.prototype.toString = function () {
        var ret = {
            id: this.Id,
            error: this.Error,
            data: {},
        };
        this.Data.forEach(function (value, key, map) {
            ret.data[key] = value;
        });
        return JSON.stringify(ret);
    };
    return UserResponse;
}());
exports.UserResponse = UserResponse;
var UserRequest = /** @class */ (function () {
    function UserRequest(id, target, headers, data) {
        this.Id = id;
        this.Target = target;
        this.Headers = headers;
        this.Data = data;
    }
    UserRequest.prototype.toString = function () {
        var ret = {
            id: this.Id,
            target: this.Target,
            headers: {},
            data: {},
        };
        this.Headers.forEach(function (value, key, map) {
            ret.headers[key] = value;
        });
        this.Data.forEach(function (value, key, map) {
            ret.data[key] = value;
        });
        return JSON.stringify(ret);
    };
    return UserRequest;
}());
exports.UserRequest = UserRequest;
