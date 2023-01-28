/// <reference types="node" />
import { PacketParser } from "..";
export default class UBX_NAV_PVT_Parser extends PacketParser {
    constructor();
    parse(payload: Buffer): UBX_NAV_PVT_DATA;
}
export interface UBX_NAV_PVT_DATA {
    iTOW: number;
    year: number;
    month: number;
    day: number;
    hour: number;
    min: number;
    sec: number;
    validDate: boolean;
    validTime: boolean;
    fullyResolved: boolean;
    validMag: boolean;
    tAcc: number;
    nano: number;
    fixType: number;
    gnssFixOK: boolean;
    diffSoln: boolean;
    psmState: number;
    headVehValid: boolean;
    carrSoln: number;
    confirmedAvai: boolean;
    confirmedDate: boolean;
    confirmedTime: boolean;
    numSV: number;
    lon: number;
    lat: number;
    height: number;
    hMSL: number;
    hAcc: number;
    vAcc: number;
    velN: number;
    velE: number;
    velD: number;
    gSpeed: number;
    headMot: number;
    sAcc: number;
    headAcc: number;
    pDOP: number;
    invalidLlh: boolean;
    lastCorrectionAge: number;
    headVeh: number;
    magDec: number;
    magAcc: number;
}
//# sourceMappingURL=ubx-nav-pvt.d.ts.map