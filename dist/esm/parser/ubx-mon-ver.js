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
import { PacketParser } from "../PacketParser";
var UBX_MON_VER_Parser = /** @class */ (function (_super) {
    __extends(UBX_MON_VER_Parser, _super);
    function UBX_MON_VER_Parser() {
        // pass packet_class and packet_id for identification
        return _super.call(this, 0x0A, 0x04) || this;
    }
    UBX_MON_VER_Parser.prototype.parse = function (payload) {
        var extension = [];
        for (var i = 40; i < payload.length - 30; i += 30) {
            var buf = payload.subarray(i, i + 30);
            extension.push(buf.toString('ascii', 0, buf.indexOf(0)));
        }
        var swBuf = payload.subarray(0, 30);
        var hwBuf = payload.subarray(30, 40);
        return {
            swVersion: swBuf.toString('ascii', 0, swBuf.indexOf(0)),
            hwVersion: hwBuf.toString('ascii', 0, hwBuf.indexOf(0)),
            extension: extension
        };
    };
    return UBX_MON_VER_Parser;
}(PacketParser));
export { UBX_MON_VER_Parser };
