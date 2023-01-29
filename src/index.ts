import fs from "fs";

export class UBXParser {
    private parsers: Array<PacketParser> = [];
    private packetListeners: Map<string, Array<(data: any) => void>> = new Map();
    private localBuffer: Buffer = Buffer.from("");

    constructor() {
        try {
            fs.readdirSync(__dirname + "/parser").forEach((file) => {
                if (file.match(/\.(?:ts|js)/)) {
                    const Parser = require("./parser/" + file).default;
                    const parser_instance = new Parser();
                    if (parser_instance instanceof PacketParser) this.registerParser(parser_instance);
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    parse(buffer: Buffer): void {
        this.localBuffer = Buffer.concat([this.localBuffer, buffer]);

        const packet_start = this.localBuffer.indexOf(Buffer.from([0xb5, 0x62]));
        const packet_end = this.localBuffer.indexOf(Buffer.from([0xb5, 0x62]), 2);
        if (packet_start != 0 && packet_end > 0) {
            this.localBuffer = this.localBuffer.subarray(packet_end);
            return this.packetListeners.get("warning")?.forEach((listener) => listener(new Error("invalide packet droped")));
        }

        if (packet_start != 0 || packet_end == -1) return;

        const packet = this.localBuffer.subarray(0, packet_end);
        this.localBuffer = this.localBuffer.subarray(packet_end);

        if (packet.length < 8) return this.packetListeners.get("error")?.forEach((listener) => listener(new Error("invalide packet size")));

        const packet_class = packet.readUInt8(2);
        const packet_id = packet.readUInt8(3);
        const packet_size = packet.readUInt16LE(4);
        const payload = packet.subarray(6, 6 + packet_size);

        if (payload.length != packet_size)
            return this.packetListeners.get("error")?.forEach((listener) => listener(new Error("invalide packet payload")));

        this.parsers.forEach((parser) => {
            if (parser.compareSignature(packet_class, packet_id)) {
                this.packetListeners.get("data")?.forEach((listener) => {
                    try {
                        listener(parser.parse(payload));
                    } catch (error) {
                        this.packetListeners.get("error")?.forEach((listener) => listener(error));
                    }
                });
            }
        });
    }

    registerParser(parser: PacketParser): void {
        this.parsers.push(parser);
    }

    unregisterParser(parser: PacketParser): void {
        this.parsers = this.parsers.filter((_parser) => _parser != parser);
    }

    on(event: "warning" | "error" | "data", cb: (data: any) => void): void {
        if (this.packetListeners.has(event)) this.packetListeners.get(event)?.push(cb);
        else this.packetListeners.set(event, [cb]);
    }
}

export abstract class PacketParser {
    private packet_class: number;
    private packet_id: number;

    constructor(packet_class: number, packet_id: number) {
        this.packet_class = packet_class;
        this.packet_id = packet_id;
    }

    compareSignature(packet_class: number, packet_id: number): boolean {
        return this.packet_class == packet_class && this.packet_id == packet_id;
    }

    abstract parse(payload: Buffer): Object | never;
}

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

interface PacketParserImport {
    default: PacketParser;
}
