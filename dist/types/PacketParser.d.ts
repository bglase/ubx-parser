/// <reference types="node" />
export declare abstract class PacketParser {
    private packet_class;
    private packet_id;
    constructor(packet_class: number, packet_id: number);
    compareSignature(packet_class: number, packet_id: number): boolean;
    abstract parse(payload: Buffer): Object | never;
}
