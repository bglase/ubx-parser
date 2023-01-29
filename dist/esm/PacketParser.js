var PacketParser = /** @class */ (function () {
    function PacketParser(packet_class, packet_id) {
        this.packet_class = packet_class;
        this.packet_id = packet_id;
    }
    PacketParser.prototype.compareSignature = function (packet_class, packet_id) {
        return this.packet_class == packet_class && this.packet_id == packet_id;
    };
    return PacketParser;
}());
export { PacketParser };
