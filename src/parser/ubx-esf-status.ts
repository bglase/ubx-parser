import { readBitFromUInt8 } from "../Utils";
import { PacketParser } from "../PacketParser";

export class UBX_ESF_STATUS_Parser extends PacketParser {
    constructor() {
        super(0x10, 0x10);
    }

    parse(payload: Buffer): UBX_ESF_STATUS_DATA {
        const data: UBX_ESF_STATUS_DATA = {
            iTOW: payload.readUInt32LE(0),
            version: payload.readUInt8(4),
            wtInitStatus: readBitFromUInt8(payload.readUInt8(5), 0, 2),
            mntAlgStatus: readBitFromUInt8(payload.readUInt8(5), 2, 3),
            insInitStatus: readBitFromUInt8(payload.readUInt8(5), 5, 2),
            imuInitStatus: readBitFromUInt8(payload.readUInt8(6), 0, 2),
            fusionMode: payload.readUInt8(12),
            numSens: payload.readUInt8(15),
            sensors: [],
        };

        for (var group = 0; group < data.numSens; group++) {
            const group_payload = payload.subarray(16 + group * 4, 20 + group * 4);
            if (group_payload.length != 4) continue;

            data.sensors.push({
                type: readBitFromUInt8(group_payload.readUInt8(0), 0, 6),
                used: readBitFromUInt8(group_payload.readUInt8(0), 6) == 1,
                ready: readBitFromUInt8(group_payload.readUInt8(0), 7) == 1,
                calibStatus: readBitFromUInt8(group_payload.readUInt8(1), 0, 2),
                timeStatus: readBitFromUInt8(group_payload.readUInt8(1), 2, 2),
                freq: group_payload.readUInt8(2),
                badMeas: readBitFromUInt8(group_payload.readUInt8(3), 0),
                badTTag: readBitFromUInt8(group_payload.readUInt8(3), 1),
                missingMeas: readBitFromUInt8(group_payload.readUInt8(3), 2),
                noisyMeas: readBitFromUInt8(group_payload.readUInt8(3), 3),
            });
        }

        return data;
    }
}

export interface UBX_ESF_STATUS_DATA {
    iTOW: number;
    version: number;
    wtInitStatus: number;
    mntAlgStatus: number;
    insInitStatus: number;
    imuInitStatus: number;
    fusionMode: number;
    numSens: number;
    sensors: [UBX_ESF_STATUS_SENSOR?];
}

export interface UBX_ESF_STATUS_SENSOR {
    type: number;
    used: boolean;
    ready: boolean;
    calibStatus: number;
    timeStatus: number;
    freq: number;
    badMeas: number;
    badTTag: number;
    missingMeas: number;
    noisyMeas: number;
}
