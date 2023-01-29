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
exports.UBX_ESF_STATUS_Parser = void 0;
var Utils_1 = require("../Utils");
var PacketParser_1 = require("../PacketParser");
var UBX_ESF_STATUS_Parser = /** @class */ (function (_super) {
    __extends(UBX_ESF_STATUS_Parser, _super);
    function UBX_ESF_STATUS_Parser() {
        return _super.call(this, 0x10, 0x10) || this;
    }
    UBX_ESF_STATUS_Parser.prototype.parse = function (payload) {
        var data = {
            iTOW: payload.readUInt32LE(0),
            version: payload.readUInt8(4),
            wtInitStatus: (0, Utils_1.readBitFromUInt8)(payload.readUInt8(5), 0, 2),
            mntAlgStatus: (0, Utils_1.readBitFromUInt8)(payload.readUInt8(5), 2, 3),
            insInitStatus: (0, Utils_1.readBitFromUInt8)(payload.readUInt8(5), 5, 2),
            imuInitStatus: (0, Utils_1.readBitFromUInt8)(payload.readUInt8(6), 0, 2),
            fusionMode: payload.readUInt8(12),
            numSens: payload.readUInt8(15),
            sensors: [],
        };
        for (var group = 0; group < data.numSens; group++) {
            var group_payload = payload.subarray(16 + group * 4, 20 + group * 4);
            if (group_payload.length != 4)
                continue;
            data.sensors.push({
                type: (0, Utils_1.readBitFromUInt8)(group_payload.readUInt8(0), 0, 6),
                used: (0, Utils_1.readBitFromUInt8)(group_payload.readUInt8(0), 6) == 1,
                ready: (0, Utils_1.readBitFromUInt8)(group_payload.readUInt8(0), 7) == 1,
                calibStatus: (0, Utils_1.readBitFromUInt8)(group_payload.readUInt8(1), 0, 2),
                timeStatus: (0, Utils_1.readBitFromUInt8)(group_payload.readUInt8(1), 2, 2),
                freq: group_payload.readUInt8(2),
                badMeas: (0, Utils_1.readBitFromUInt8)(group_payload.readUInt8(3), 0),
                badTTag: (0, Utils_1.readBitFromUInt8)(group_payload.readUInt8(3), 1),
                missingMeas: (0, Utils_1.readBitFromUInt8)(group_payload.readUInt8(3), 2),
                noisyMeas: (0, Utils_1.readBitFromUInt8)(group_payload.readUInt8(3), 3),
            });
        }
        return data;
    };
    return UBX_ESF_STATUS_Parser;
}(PacketParser_1.PacketParser));
exports.UBX_ESF_STATUS_Parser = UBX_ESF_STATUS_Parser;
