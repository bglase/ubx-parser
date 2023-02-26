import { PacketParser } from "./PacketParser";
import { UBX_ESF_MEAS_Parser } from "./parser/ubx-esf-meas";
import { UBX_ESF_STATUS_Parser } from "./parser/ubx-esf-status";
import { UBX_NAV_PVT_Parser } from "./parser/ubx-nav-pvt";

export class UBXParser {
    private parsers: Array<PacketParser> = [];
    private packetListeners: Map<string, Array<(data: any, buffer?: Buffer) => void>> = new Map();
    private localBuffer: Buffer = Buffer.from("");

    constructor() {
        this.registerParser(new UBX_NAV_PVT_Parser());
        this.registerParser(new UBX_ESF_STATUS_Parser());
        this.registerParser(new UBX_ESF_MEAS_Parser());
    }

    parse(buffer: Buffer): void {
        this.localBuffer = Buffer.concat([this.localBuffer, buffer]);

        while (this.localBuffer.length > 0) {
            const packet_start = this.localBuffer.indexOf(Buffer.from([0xb5, 0x62]));
            const packet_end = this.localBuffer.indexOf(Buffer.from([0xb5, 0x62]), 2);
            if (packet_start != 0 && packet_end > 0) {
                this.localBuffer = this.localBuffer.subarray(packet_end);
                return this.packetListeners.get("warning")?.forEach((listener) => listener(new Error("invalide packet droped"), undefined));
            }

            if (packet_start != 0 || packet_end == -1) return;

            const packet = this.localBuffer.subarray(0, packet_end);
            this.localBuffer = this.localBuffer.subarray(packet_end);

            if (packet.length < 8)
                return this.packetListeners.get("error")?.forEach((listener) => listener(new Error("invalide packet size"), packet));

            const packet_class = packet.readUInt8(2);
            const packet_id = packet.readUInt8(3);
            const packet_size = packet.readUInt16LE(4);
            const payload = packet.subarray(6, 6 + packet_size);

            if (payload.length != packet_size)
                return this.packetListeners.get("error")?.forEach((listener) => listener(new Error("invalide packet payload"), packet));

            this.parsers.forEach((parser) => {
                if (parser.compareSignature(packet_class, packet_id)) {
                    this.packetListeners.get("data")?.forEach((listener) => {
                        try {
                            const data = parser.parse(payload) as any;
                            data.packet_class = packet_class;
                            data.packet_id = packet_id;
                            listener(data);
                        } catch (error) {
                            this.packetListeners.get("error")?.forEach((listener) => listener(error));
                        }
                    });
                }
            });
        }
    }

    registerParser(parser: PacketParser): void {
        this.parsers.push(parser);
    }

    unregisterParser(parser: PacketParser): void {
        this.parsers = this.parsers.filter((_parser) => _parser != parser);
    }

    on(event: "warning" | "error" | "data", cb: (data: any, buffer?: Buffer) => void): void {
        if (this.packetListeners.has(event)) this.packetListeners.get(event)?.push(cb);
        else this.packetListeners.set(event, [cb]);
    }
}
