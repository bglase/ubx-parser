"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readBitFromUInt32 = exports.readBitFromUInt16 = exports.readBitFromUInt8 = exports.PacketParser = exports.UBXParser = void 0;
var fs_1 = __importDefault(require("fs"));
var UBXParser = /** @class */ (function () {
    function UBXParser() {
        var _this = this;
        this.parsers = [];
        this.packetListeners = new Map();
        this.localBuffer = Buffer.from("");
        try {
            fs_1.default.readdirSync(__dirname + "/parser").forEach(function (file) {
                if (file.match(/\.(?:ts|js)/)) {
                    var Parser = require("./parser/" + file).default;
                    var parser_instance = new Parser();
                    if (parser_instance instanceof PacketParser)
                        _this.registerParser(parser_instance);
                }
            });
        }
        catch (error) {
            console.error(error);
        }
    }
    UBXParser.prototype.parse = function (buffer) {
        var _this = this;
        var _a, _b, _c;
        this.localBuffer = Buffer.concat([this.localBuffer, buffer]);
        var packet_start = this.localBuffer.indexOf(Buffer.from([0xb5, 0x62]));
        var packet_end = this.localBuffer.indexOf(Buffer.from([0xb5, 0x62]), 2);
        if (packet_start != 0 && packet_end > 0) {
            this.localBuffer = this.localBuffer.subarray(packet_end);
            return (_a = this.packetListeners.get("warning")) === null || _a === void 0 ? void 0 : _a.forEach(function (listener) { return listener(new Error("invalide packet droped")); });
        }
        if (packet_start != 0 || packet_end == -1)
            return;
        var packet = this.localBuffer.subarray(0, packet_end);
        this.localBuffer = this.localBuffer.subarray(packet_end);
        if (packet.length < 8)
            return (_b = this.packetListeners.get("error")) === null || _b === void 0 ? void 0 : _b.forEach(function (listener) { return listener(new Error("invalide packet size")); });
        var packet_class = packet.readUInt8(2);
        var packet_id = packet.readUInt8(3);
        var packet_size = packet.readUInt16LE(4);
        var payload = packet.subarray(6, 6 + packet_size);
        if (payload.length != packet_size)
            return (_c = this.packetListeners.get("error")) === null || _c === void 0 ? void 0 : _c.forEach(function (listener) { return listener(new Error("invalide packet payload")); });
        this.parsers.forEach(function (parser) {
            var _a;
            if (parser.compareSignature(packet_class, packet_id)) {
                (_a = _this.packetListeners.get("data")) === null || _a === void 0 ? void 0 : _a.forEach(function (listener) {
                    var _a;
                    try {
                        listener(parser.parse(payload));
                    }
                    catch (error) {
                        (_a = _this.packetListeners.get("error")) === null || _a === void 0 ? void 0 : _a.forEach(function (listener) { return listener(error); });
                    }
                });
            }
        });
    };
    UBXParser.prototype.registerParser = function (parser) {
        this.parsers.push(parser);
    };
    UBXParser.prototype.unregisterParser = function (parser) {
        this.parsers = this.parsers.filter(function (_parser) { return _parser != parser; });
    };
    UBXParser.prototype.on = function (event, cb) {
        var _a;
        if (this.packetListeners.has(event))
            (_a = this.packetListeners.get(event)) === null || _a === void 0 ? void 0 : _a.push(cb);
        else
            this.packetListeners.set(event, [cb]);
    };
    return UBXParser;
}());
exports.UBXParser = UBXParser;
var PacketParser = /** @class */ (function () {
    function PacketParser(packet_class, packet_id) {
        this.packet_class = packet_class;
        this.packet_id = packet_id;
    }
    PacketParser.prototype.compareSignature = function (packet_class, packet_id) {
        return this.packet_class == packet_class && this.packet_id == packet_id;
    };
    return PacketParser;
}());
exports.PacketParser = PacketParser;
function readBitFromUInt8(byte, offset, length) {
    if (offset === void 0) { offset = 0; }
    if (length === void 0) { length = 1; }
    var mask = 0xff >> (8 - length);
    var bit_offset = mask << offset;
    return (byte & bit_offset) >> offset;
}
exports.readBitFromUInt8 = readBitFromUInt8;
function readBitFromUInt16(byte, offset, length) {
    if (offset === void 0) { offset = 0; }
    if (length === void 0) { length = 1; }
    if (offset <= 7 && offset + length > 8) {
        var blockA = readBitFromUInt8(byte & 0xff, offset, offset + length > 8 ? 8 - offset : length);
        var blockB = readBitFromUInt8((byte >> 8) & 0xff, 0, offset + length - 8);
        return (blockB << (8 - offset)) | blockA;
    }
    else if (offset <= 7) {
        return readBitFromUInt8(byte, offset, length);
    }
    else {
        return readBitFromUInt8((byte >> 8) & 0xff, offset - 8, length);
    }
}
exports.readBitFromUInt16 = readBitFromUInt16;
function readBitFromUInt32(byte, offset, length) {
    if (offset === void 0) { offset = 0; }
    if (length === void 0) { length = 1; }
    if (offset <= 15 && offset + length > 16) {
        var blockA = readBitFromUInt16(byte & 0xffff, offset, offset + length > 16 ? 16 - offset : length);
        var blockB = readBitFromUInt16((byte >> 16) & 0xffff, 0, offset + length - 16);
        return (blockB << (16 - offset)) | blockA;
    }
    else if (offset <= 15) {
        return readBitFromUInt16(byte, offset, length);
    }
    else {
        return readBitFromUInt16((byte >> 16) & 0xffff, offset - 16, length);
    }
}
exports.readBitFromUInt32 = readBitFromUInt32;
//# sourceMappingURL=index.js.map