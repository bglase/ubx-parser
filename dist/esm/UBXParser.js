import { UBX_NAV_PVT_Parser } from "./parser/ubx-nav-pvt";
var UBXParser = /** @class */ (function () {
    function UBXParser() {
        this.parsers = [];
        this.packetListeners = new Map();
        this.localBuffer = Buffer.from("");
        this.registerParser(new UBX_NAV_PVT_Parser());
    }
    UBXParser.prototype.parse = function (buffer) {
        var _this = this;
        var _a, _b, _c;
        this.localBuffer = Buffer.concat([this.localBuffer, buffer]);
        var packet_start = this.localBuffer.indexOf(Buffer.from([0xb5, 0x62]));
        var packet_end = this.localBuffer.indexOf(Buffer.from([0xb5, 0x62]), 2);
        if (packet_start != 0 && packet_end > 0) {
            this.localBuffer = this.localBuffer.subarray(packet_end);
            return (_a = this.packetListeners.get("warning")) === null || _a === void 0 ? void 0 : _a.forEach(function (listener) { return listener(new Error("invalide packet droped")); });
        }
        if (packet_start != 0 || packet_end == -1)
            return;
        var packet = this.localBuffer.subarray(0, packet_end);
        this.localBuffer = this.localBuffer.subarray(packet_end);
        if (packet.length < 8)
            return (_b = this.packetListeners.get("error")) === null || _b === void 0 ? void 0 : _b.forEach(function (listener) { return listener(new Error("invalide packet size")); });
        var packet_class = packet.readUInt8(2);
        var packet_id = packet.readUInt8(3);
        var packet_size = packet.readUInt16LE(4);
        var payload = packet.subarray(6, 6 + packet_size);
        if (payload.length != packet_size)
            return (_c = this.packetListeners.get("error")) === null || _c === void 0 ? void 0 : _c.forEach(function (listener) { return listener(new Error("invalide packet payload")); });
        this.parsers.forEach(function (parser) {
            var _a;
            if (parser.compareSignature(packet_class, packet_id)) {
                (_a = _this.packetListeners.get("data")) === null || _a === void 0 ? void 0 : _a.forEach(function (listener) {
                    var _a;
                    try {
                        listener(parser.parse(payload));
                    }
                    catch (error) {
                        (_a = _this.packetListeners.get("error")) === null || _a === void 0 ? void 0 : _a.forEach(function (listener) { return listener(error); });
                    }
                });
            }
        });
    };
    UBXParser.prototype.registerParser = function (parser) {
        this.parsers.push(parser);
    };
    UBXParser.prototype.unregisterParser = function (parser) {
        this.parsers = this.parsers.filter(function (_parser) { return _parser != parser; });
    };
    UBXParser.prototype.on = function (event, cb) {
        var _a;
        if (this.packetListeners.has(event))
            (_a = this.packetListeners.get(event)) === null || _a === void 0 ? void 0 : _a.push(cb);
        else
            this.packetListeners.set(event, [cb]);
    };
    return UBXParser;
}());
export { UBXParser };
