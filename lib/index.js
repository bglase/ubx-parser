"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readBitFromUInt32 = exports.readBitFromUInt16 = exports.readBitFromUInt8 = exports.PacketParser = void 0;
class UBXParser {
    constructor() {
        this.parsers = [];
        this.packetListeners = new Map();
        this.localBuffer = Buffer.from("");
    }
    parse(buffer) {
        var _a, _b, _c;
        this.localBuffer = Buffer.concat([this.localBuffer, buffer]);
        const packet_start = this.localBuffer.indexOf(Buffer.from([0xb5, 0x62]));
        const packet_end = this.localBuffer.indexOf(Buffer.from([0xb5, 0x62]), 2);
        if (packet_start != 0 && packet_end > 0) {
            this.localBuffer = this.localBuffer.subarray(packet_end);
            return (_a = this.packetListeners.get("warning")) === null || _a === void 0 ? void 0 : _a.forEach((listener) => listener(new Error("invalide packet droped")));
        }
        if (packet_start != 0 || packet_end == -1)
            return;
        const packet = this.localBuffer.subarray(0, packet_end);
        this.localBuffer = this.localBuffer.subarray(packet_end);
        if (packet.length < 8)
            return (_b = this.packetListeners.get("error")) === null || _b === void 0 ? void 0 : _b.forEach((listener) => listener(new Error("invalide packet size")));
        const packet_class = packet.readUInt8(2);
        const packet_id = packet.readUInt8(3);
        const packet_size = packet.readUInt16LE(4);
        const payload = packet.subarray(6, 6 + packet_size);
        if (payload.length != packet_size)
            return (_c = this.packetListeners.get("error")) === null || _c === void 0 ? void 0 : _c.forEach((listener) => listener(new Error("invalide packet payload")));
        this.parsers.forEach((parser) => {
            var _a;
            if (parser.compareSignature(packet_class, packet_id)) {
                console.log(packet_id, parser.compareSignature(packet_class, packet_id));
                (_a = this.packetListeners.get("data")) === null || _a === void 0 ? void 0 : _a.forEach((listener) => {
                    var _a;
                    try {
                        listener(parser.parse(payload));
                    }
                    catch (error) {
                        (_a = this.packetListeners.get("error")) === null || _a === void 0 ? void 0 : _a.forEach((listener) => listener(error));
                    }
                });
            }
        });
    }
    registerParser(parser) {
        this.parsers.push(parser);
    }
    unregisterParser(parser) {
        this.parsers = this.parsers.filter((_parser) => _parser != parser);
    }
    on(event, cb) {
        var _a;
        if (this.packetListeners.has(event))
            (_a = this.packetListeners.get(event)) === null || _a === void 0 ? void 0 : _a.push(cb);
        else
            this.packetListeners.set(event, [cb]);
    }
}
exports.default = UBXParser;
class PacketParser {
    constructor(packet_class, packet_id) {
        this.packet_class = packet_class;
        this.packet_id = packet_id;
    }
    compareSignature(packet_class, packet_id) {
        return this.packet_class == packet_class && this.packet_id == packet_id;
    }
}
exports.PacketParser = PacketParser;
function readBitFromUInt8(byte, offset = 0, length = 1) {
    const mask = 0xff >> (8 - length);
    const bit_offset = mask << offset;
    return (byte & bit_offset) >> offset;
}
exports.readBitFromUInt8 = readBitFromUInt8;
function readBitFromUInt16(byte, offset = 0, length = 1) {
    if (offset <= 7 && offset + length > 8) {
        const blockA = readBitFromUInt8(byte & 0xff, offset, offset + length > 8 ? 8 - offset : length);
        const blockB = readBitFromUInt8((byte >> 8) & 0xff, 0, offset + length - 8);
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
function readBitFromUInt32(byte, offset = 0, length = 1) {
    if (offset <= 15 && offset + length > 16) {
        const blockA = readBitFromUInt16(byte & 0xffff, offset, offset + length > 16 ? 16 - offset : length);
        const blockB = readBitFromUInt16((byte >> 16) & 0xffff, 0, offset + length - 16);
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