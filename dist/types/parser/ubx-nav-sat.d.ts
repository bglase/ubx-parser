/**
 * UBX Message payload definition
 */
/// <reference types="node" />
import { PacketParser } from "../PacketParser";
import { UBX_GnssId } from "../types";
export declare class UBX_NAV_SAT_Parser extends PacketParser {
    constructor();
    parse(payload: Buffer): UBX_NAV_SAT_PAYLOAD;
}
export interface UBX_NAV_SAT_SV {
    gnssId: UBX_GnssId;
    svId: number;
    cno: number;
    elev: number;
    azim: number;
    prRes: number;
    lastCorrectionAge: number;
    svUsed: boolean;
    health: number;
    diffCorr: boolean;
    smoothed: boolean;
    orbitSource: number;
    ephAvail: boolean;
    almAvail: boolean;
    anoAvail: boolean;
    aopAvail: boolean;
    sbasCorrUsed: boolean;
    rtcmCorrUsed: boolean;
    slasCorrUsed: boolean;
    spartnCorrUsed: boolean;
    prCorrUsed: boolean;
    crCorrUsed: boolean;
    doCorrUsed: boolean;
    clasCorrUsed: boolean;
}
export interface UBX_NAV_SAT_PAYLOAD {
    iTOW: number;
    version: number;
    numSvs: number;
    svs: UBX_NAV_SAT_SV[];
}
