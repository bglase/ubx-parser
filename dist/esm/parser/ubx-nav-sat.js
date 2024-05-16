/**
 * UBX Message payload definition
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { readBitFromUInt32 } from "../Utils";
import { PacketParser } from "../PacketParser";
var UBX_NAV_SAT_Parser = /** @class */ (function (_super) {
    __extends(UBX_NAV_SAT_Parser, _super);
    function UBX_NAV_SAT_Parser() {
        // pass packet_class and packet_id for identification
        return _super.call(this, 0x01, 0x35) || this;
    }
    UBX_NAV_SAT_Parser.prototype.parse = function (payload) {
        var svs = [];
        var buf = payload.subarray(8);
        for (var i = 0; i <= buf.length - 12; i += 12) {
            var sv = buf.subarray(i, i + 12);
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
    };
    return UBX_NAV_SAT_Parser;
}(PacketParser));
export { UBX_NAV_SAT_Parser };
;
