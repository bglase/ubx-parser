/**
 * UBX Message payload definition
 */

import { readBitFromUInt32, readBitFromUInt8 } from "../Utils";
import { PacketParser } from "../PacketParser";
import { UBX_GnssId } from "../types";


export class UBX_NAV_SAT_Parser extends PacketParser {
  constructor() {
    // pass packet_class and packet_id for identification
    super(0x01, 0x35);
  }

  parse(payload: Buffer): UBX_NAV_SAT_PAYLOAD {
    let svs: UBX_NAV_SAT_SV[] = [];

    let buf = payload.subarray(8);

    for (let i = 0; i <= buf.length - 12; i += 12) {
      let sv = buf.subarray(i, i + 12);
      svs.push({
        gnssId: sv[0],
        svId: sv[1],
        cno: sv[2],
        elev: sv.readInt8(3),
        azim: sv.readInt16LE(4),
        prRes: sv.readInt16LE(6),
        lastCorrectionAge: readBitFromUInt32(sv.readUInt16LE(8), 0, 3),
        svUsed: (readBitFromUInt32(sv.readUInt16LE(8), 3) > 0),
        health: readBitFromUInt32(sv.readUInt16LE(8), 4, 2),
        diffCorr: (readBitFromUInt32(sv.readUInt16LE(8), 6) > 0),
        smoothed: (readBitFromUInt32(sv.readUInt16LE(8), 7) > 0),
        orbitSource: readBitFromUInt32(sv.readUInt16LE(8), 8, 3),
        ephAvail: (readBitFromUInt32(sv.readUInt16LE(8), 11) > 0),
        almAvail: (readBitFromUInt32(sv.readUInt16LE(8), 12) > 0),
        anoAvail: (readBitFromUInt32(sv.readUInt16LE(8), 13) > 0),
        aopAvail: (readBitFromUInt32(sv.readUInt16LE(8), 14) > 0),

        sbasCorrUsed: (readBitFromUInt32(sv.readUInt16LE(8), 16) > 0),
        rtcmCorrUsed: (readBitFromUInt32(sv.readUInt16LE(8), 17) > 0),
        slasCorrUsed: (readBitFromUInt32(sv.readUInt16LE(8), 18) > 0),
        spartnCorrUsed: (readBitFromUInt32(sv.readUInt16LE(8), 19) > 0),
        prCorrUsed: (readBitFromUInt32(sv.readUInt16LE(8), 20) > 0),
        crCorrUsed: (readBitFromUInt32(sv.readUInt16LE(8), 21) > 0),
        doCorrUsed: (readBitFromUInt32(sv.readUInt16LE(8), 22) > 0),
        clasCorrUsed: (readBitFromUInt32(sv.readUInt16LE(8), 23) > 0),
      });

    }

    return {
      iTOW: payload.readUint32LE(0),
      version: payload[4],
      numSvs: payload[5],
      //uint8_t reserved[2];
      svs: svs,

    };
  }
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
  // reserved bit
  sbasCorrUsed: boolean;
  rtcmCorrUsed: boolean;
  slasCorrUsed: boolean;
  spartnCorrUsed: boolean;
  prCorrUsed: boolean;
  crCorrUsed: boolean;
  doCorrUsed: boolean;
  clasCorrUsed: boolean;
};

export interface UBX_NAV_SAT_PAYLOAD {
  iTOW: number;
  version: number;
  numSvs: number;
  svs: UBX_NAV_SAT_SV[];
}


