/// <reference types="node" />
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
export declare abstract class PacketParser {
    private packet_class;
    private packet_id;
    constructor(packet_class: number, packet_id: number);
    compareSignature(packet_class: number, packet_id: number): boolean;
    abstract parse(payload: Buffer): Object | never;
}
export declare function readBitFromUInt8(byte: number, offset?: number, length?: number): number;
export declare function readBitFromUInt16(byte: number, offset?: number, length?: number): number;
export declare function readBitFromUInt32(byte: number, offset?: number, length?: number): number;
//# sourceMappingURL=index.d.ts.map