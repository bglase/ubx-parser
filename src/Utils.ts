export function readBitFromUInt8(byte: number, offset = 0, length = 1) {
    const mask = 0xff >> (8 - length);
    const bit_offset = mask << offset;
    return (byte & bit_offset) >> offset;
}

export function readBitFromUInt16(byte: number, offset = 0, length = 1) {
    if (offset <= 7 && offset + length > 8) {
        const blockA = readBitFromUInt8(byte & 0xff, offset, offset + length > 8 ? 8 - offset : length);
        const blockB = readBitFromUInt8((byte >> 8) & 0xff, 0, offset + length - 8);
        return (blockB << (8 - offset)) | blockA;
    } else if (offset <= 7) {
        return readBitFromUInt8(byte, offset, length);
    } else {
        return readBitFromUInt8((byte >> 8) & 0xff, offset - 8, length);
    }
}

export function readBitFromUInt32(byte: number, offset = 0, length = 1) {
    if (offset <= 15 && offset + length > 16) {
        const blockA = readBitFromUInt16(byte & 0xffff, offset, offset + length > 16 ? 16 - offset : length);
        const blockB = readBitFromUInt16((byte >> 16) & 0xffff, 0, offset + length - 16);
        return (blockB << (16 - offset)) | blockA;
    } else if (offset <= 15) {
        return readBitFromUInt16(byte, offset, length);
    } else {
        return readBitFromUInt16((byte >> 16) & 0xffff, offset - 16, length);
    }
}
