/// <reference types="node" />
import { PacketParser } from "../PacketParser";
export declare class UBX_ESF_MEAS_Parser extends PacketParser {
    constructor();
    parse(payload: Buffer): UBX_ESF_MEAS_DATA;
}
export interface UBX_ESF_MEAS_DATA {
    timeTag: number;
    timeMarkSent: number;
    timeMarkEdge: number;
    calibTtagValid: boolean;
    numMeas: number;
    measurements: [UBX_ESF_MEAS_MEASUREMENT?];
}
export interface UBX_ESF_MEAS_MEASUREMENT {
    dataField: number;
    dataType: number;
    calibTtag: number;
}
