/// <reference types="node" />
import { PacketParser } from "../PacketParser";
export declare class UBX_ESF_STATUS_Parser extends PacketParser {
    constructor();
    parse(payload: Buffer): UBX_ESF_STATUS_DATA;
}
interface UBX_ESF_STATUS_DATA {
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
interface UBX_ESF_STATUS_SENSOR {
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
export {};
