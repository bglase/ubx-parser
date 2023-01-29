import { readBitFromUInt16, readBitFromUInt32 } from "../Utils";
import { PacketParser } from "../PacketParser";

export class UBX_ESF_MEAS_Parser extends PacketParser {
    constructor() {
        super(0x10, 0x02);
    }

    parse(payload: Buffer): UBX_ESF_MEAS_DATA {
        const data: UBX_ESF_MEAS_DATA = {
            timeTag: payload.readUInt32LE(0),
            timeMarkSent: readBitFromUInt16(payload.readUInt16LE(4), 0, 2),
            timeMarkEdge: readBitFromUInt16(payload.readUInt16LE(4), 2),
            calibTtagValid: readBitFromUInt16(payload.readUInt16LE(4), 3) == 1,
            numMeas: readBitFromUInt16(payload.readUInt16LE(4), 11, 5),
            measurements: [],
        };

        for (var group = 0; group < data.numMeas; group++) {
            const group_payload = payload.subarray(8 + group * 4, 12 + group * 4);
            if (group_payload.length != 4) continue;

            data.measurements.push({
                dataField: readBitFromUInt32(group_payload.readUInt32LE(0), 0, 24),
                dataType: readBitFromUInt32(group_payload.readUInt32LE(0), 24, 6),
                calibTtag: payload.readUInt32LE(1),
            });
        }

        return data;
    }
}

interface UBX_ESF_MEAS_DATA {
    timeTag: number;
    timeMarkSent: number;
    timeMarkEdge: number;
    calibTtagValid: boolean;
    numMeas: number;
    measurements: [UBX_ESF_MEAS_MEASUREMENT?];
}

interface UBX_ESF_MEAS_MEASUREMENT {
    dataField: number;
    dataType: number;
    calibTtag: number;
}
