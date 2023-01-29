"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readBitFromUInt32 = exports.readBitFromUInt16 = exports.readBitFromUInt8 = void 0;
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
