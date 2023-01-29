import { Socket } from "net";
import { UBXParser } from "./src";
var parser = new UBXParser();
var client = new Socket();
client.connect({ host: "192.168.1.154", port: 1234 }, function () { return console.log("connected"); });
client.on("data", function (buffer) { return parser.parse(buffer); });
parser.on("error", function (error) { return console.error(error); });
parser.on("data", function (data) { return console.log(data); });
