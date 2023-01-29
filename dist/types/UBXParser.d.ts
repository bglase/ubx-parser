/// <reference types="node" />
import { PacketParser } from "./PacketParser";
export declare class UBXParser {
    private parsers;
    private packetListeners;
    private localBuffer;
    constructor();
    parse(buffer: Buffer): void;
    registerParser(parser: PacketParser): void;
    unregisterParser(parser: PacketParser): void;
    on(event: "warning" | "error" | "data", cb: (data: any) => void): void;
}
