/**
 * UBX Message definition for UBX-MON-VER
 */
import { readBitFromUInt32, readBitFromUInt8 } from "../Utils";
import { PacketParser } from "../PacketParser";


export class UBX_MON_VER_Parser extends PacketParser {
    constructor() {
        // pass packet_class and packet_id for identification
        super(0x0A, 0x04);
    }

    parse(payload: Buffer): UBX_MON_VER_PAYLOAD {
        let extension: string[] = [];
        
        for( let i = 40; i < payload.length-30; i+=30 ) {
            let buf = payload.subarray(i, i+30);
            extension.push(buf.toString('ascii', 0, buf.indexOf(0) ));
        }
        let swBuf = payload.subarray(0, 30 );
        let hwBuf = payload.subarray(30, 40 );
        return {
            swVersion: swBuf.toString('ascii', 0, swBuf.indexOf(0) ),
            hwVersion: hwBuf.toString('ascii', 0, hwBuf.indexOf(0) ),
            extension: extension
        };
    }
}

export interface UBX_MON_VER_PAYLOAD {
    swVersion: string;
    hwVersion: string;
    extension: string[];
}