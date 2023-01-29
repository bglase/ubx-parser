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
import { readBitFromUInt16, readBitFromUInt32 } from "../Utils";
import { PacketParser } from "../PacketParser";
var UBX_ESF_MEAS_Parser = /** @class */ (function (_super) {
    __extends(UBX_ESF_MEAS_Parser, _super);
    function UBX_ESF_MEAS_Parser() {
        return _super.call(this, 0x10, 0x02) || this;
    }
    UBX_ESF_MEAS_Parser.prototype.parse = function (payload) {
        var data = {
            timeTag: payload.readUInt32LE(0),
            timeMarkSent: readBitFromUInt16(payload.readUInt16LE(4), 0, 2),
            timeMarkEdge: readBitFromUInt16(payload.readUInt16LE(4), 2),
            calibTtagValid: readBitFromUInt16(payload.readUInt16LE(4), 3) == 1,
            numMeas: readBitFromUInt16(payload.readUInt16LE(4), 11, 5),
            measurements: [],
        };
        for (var group = 0; group < data.numMeas; group++) {
            var group_payload = payload.subarray(8 + group * 4, 12 + group * 4);
            if (group_payload.length != 4)
                continue;
            data.measurements.push({
                dataField: readBitFromUInt32(group_payload.readUInt32LE(0), 0, 24),
                dataType: readBitFromUInt32(group_payload.readUInt32LE(0), 24, 6),
                calibTtag: payload.readUInt32LE(1),
            });
        }
        return data;
    };
    return UBX_ESF_MEAS_Parser;
}(PacketParser));
export { UBX_ESF_MEAS_Parser };
