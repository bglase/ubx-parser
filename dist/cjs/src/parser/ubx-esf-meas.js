"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UBX_ESF_MEAS_Parser = void 0;
var Utils_1 = require("../Utils");
var PacketParser_1 = require("../PacketParser");
var UBX_ESF_MEAS_Parser = /** @class */ (function (_super) {
    __extends(UBX_ESF_MEAS_Parser, _super);
    function UBX_ESF_MEAS_Parser() {
        return _super.call(this, 0x10, 0x02) || this;
    }
    UBX_ESF_MEAS_Parser.prototype.parse = function (payload) {
        var data = {
            timeTag: payload.readUInt32LE(0),
            timeMarkSent: (0, Utils_1.readBitFromUInt16)(payload.readUInt16LE(4), 0, 2),
            timeMarkEdge: (0, Utils_1.readBitFromUInt16)(payload.readUInt16LE(4), 2),
            calibTtagValid: (0, Utils_1.readBitFromUInt16)(payload.readUInt16LE(4), 3) == 1,
            numMeas: (0, Utils_1.readBitFromUInt16)(payload.readUInt16LE(4), 11, 5),
            measurements: [],
        };
        for (var group = 0; group < data.numMeas; group++) {
            var group_payload = payload.subarray(8 + group * 4, 12 + group * 4);
            if (group_payload.length != 4)
                continue;
            data.measurements.push({
                dataField: (0, Utils_1.readBitFromUInt32)(group_payload.readUInt32LE(0), 0, 24),
                dataType: (0, Utils_1.readBitFromUInt32)(group_payload.readUInt32LE(0), 24, 6),
                calibTtag: payload.readUInt32LE(1),
            });
        }
        return data;
    };
    return UBX_ESF_MEAS_Parser;
}(PacketParser_1.PacketParser));
exports.UBX_ESF_MEAS_Parser = UBX_ESF_MEAS_Parser;
