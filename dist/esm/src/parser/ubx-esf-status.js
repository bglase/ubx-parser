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
import { readBitFromUInt8 } from "../Utils";
import { PacketParser } from "../PacketParser";
var UBX_ESF_STATUS_Parser = /** @class */ (function (_super) {
    __extends(UBX_ESF_STATUS_Parser, _super);
    function UBX_ESF_STATUS_Parser() {
        return _super.call(this, 0x10, 0x10) || this;
    }
    UBX_ESF_STATUS_Parser.prototype.parse = function (payload) {
        var data = {
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
            var group_payload = payload.subarray(16 + group * 4, 20 + group * 4);
            if (group_payload.length != 4)
                continue;
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
    };
    return UBX_ESF_STATUS_Parser;
}(PacketParser));
export { UBX_ESF_STATUS_Parser };
