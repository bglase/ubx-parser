"use strict";
/**
 * Common typescript definitions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UBX_GnssId = void 0;
var UBX_GnssId;
(function (UBX_GnssId) {
    UBX_GnssId[UBX_GnssId["GPS"] = 0] = "GPS";
    UBX_GnssId[UBX_GnssId["SBAS"] = 1] = "SBAS";
    UBX_GnssId[UBX_GnssId["GALILEO"] = 2] = "GALILEO";
    UBX_GnssId[UBX_GnssId["BEIDOU"] = 3] = "BEIDOU";
    UBX_GnssId[UBX_GnssId["QZSS"] = 5] = "QZSS";
    UBX_GnssId[UBX_GnssId["GLONASS"] = 6] = "GLONASS";
    UBX_GnssId[UBX_GnssId["NAVIC"] = 7] = "NAVIC";
})(UBX_GnssId = exports.UBX_GnssId || (exports.UBX_GnssId = {}));
