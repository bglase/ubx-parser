/// <reference types="node" />
import { PacketParser } from "../PacketParser";
export declare class UBX_MON_VER_Parser extends PacketParser {
    constructor();
    parse(payload: Buffer): UBX_MON_VER_PAYLOAD;
}
export interface UBX_MON_VER_PAYLOAD {
    swVersion: string;
    hwVersion: string;
    extension: string[];
}
