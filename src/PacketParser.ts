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
