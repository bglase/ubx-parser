"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class UBX_NAV_PVT_Parser extends __1.PacketParser {
    constructor() {
        super(0x01, 0x07);
    }
    parse(payload) {
        return {
            iTOW: payload.readUInt32LE(),
            year: payload.readUInt16LE(4),
            month: payload.readUInt8(6),
            day: payload.readUInt8(7),
            hour: payload.readUInt8(8),
            min: payload.readUInt8(9),
            sec: payload.readUInt8(10),
            validDate: (0, __1.readBitFromUInt8)(payload.readUInt8(11), 0) == 1,
            validTime: (0, __1.readBitFromUInt8)(payload.readUInt8(11), 1) == 1,
            fullyResolved: (0, __1.readBitFromUInt8)(payload.readUInt8(11), 2) == 1,
            validMag: (0, __1.readBitFromUInt8)(payload.readUInt8(11), 3) == 1,
            tAcc: payload.readUInt32LE(12),
            nano: payload.readInt32LE(16),
            fixType: payload.readUInt8(20),
            gnssFixOK: (0, __1.readBitFromUInt8)(payload.readUInt8(21), 0) == 1,
            diffSoln: (0, __1.readBitFromUInt8)(payload.readUInt8(21), 1) == 1,
            psmState: (0, __1.readBitFromUInt8)(payload.readUInt8(21), 2, 3),
            headVehValid: (0, __1.readBitFromUInt8)(payload.readUInt8(21), 5) == 1,
            carrSoln: (0, __1.readBitFromUInt8)(payload.readUInt8(21), 6, 2),
            confirmedAvai: (0, __1.readBitFromUInt8)(payload.readUInt8(22), 5) == 1,
            confirmedDate: (0, __1.readBitFromUInt8)(payload.readUInt8(22), 6) == 1,
            confirmedTime: (0, __1.readBitFromUInt8)(payload.readUInt8(22), 7) == 1,
            numSV: payload.readUInt8(23),
            lon: payload.readInt32LE(24) * 1e-7,
            lat: payload.readInt32LE(28) * 1e-7,
            height: payload.readInt32LE(32),
            hMSL: payload.readInt32LE(36),
            hAcc: payload.readUInt32LE(40),
            vAcc: payload.readUInt32LE(44),
            velN: payload.readInt32LE(48),
            velE: payload.readInt32LE(52),
            velD: payload.readInt32LE(56),
            gSpeed: payload.readInt32LE(60),
            headMot: payload.readInt32LE(64) * 1e-5,
            sAcc: payload.readUInt32LE(68),
            headAcc: payload.readUInt32LE(72) * 1e-5,
            pDOP: payload.readUInt16LE(76) * 0.01,
            invalidLlh: (0, __1.readBitFromUInt16)(payload.readUInt16LE(78), 0) == 1,
            lastCorrectionAge: (0, __1.readBitFromUInt16)(payload.readUInt16LE(78), 1, 4),
            headVeh: payload.readInt32LE(84) * 1e-5,
            magDec: payload.readInt16LE(88) * 1e-2,
            magAcc: payload.readUInt16LE(90) * 1e-2,
        };
    }
}
exports.default = UBX_NAV_PVT_Parser;
//# sourceMappingURL=ubx-nav-pvt.js.map