# UBX Parser

A parser for the GNSS protocol ubx. Developed and tested with a ublox M9L GPS module.

```
npm install @nextlvlup/ubx-parser
```

This library was created based on the documentation provided by ublox.
[Interface Description](https://content.u-blox.com/sites/default/files/documents/M9-ADR-5.15_InterfaceDescription_UBX-22037101.pdf)
[Integration Manual](https://content.u-blox.com/sites/default/files/NEO-M9L_Integrationmanual_UBX-20048485.pdf)

### Very basic usage example

```ts
import { UBXParser } from "@nextlvlup/ubx-parser";

// Create Parser Instance
const parser = new UBXParser();

// Add Event Listener
parser.on("warning", (warning, buffer) => console.warn(warning));
parser.on("error", (error, buffer) => console.error(error));
parser.on("data", (data, buffer) => console.log(data));
```

the `buffer` object contains the raw data packet.

### Example over TCP/IP

If you want to provide the GNSS data from a local Linux device via TCP you can do this with the following command. `socat -d -d tcp-l:1234 file://dev/ttyS0,b460800,raw`

This command starts a TCP server and serves as a gateway between the local serial port ttyS0 and the TCP client.

```ts
import { Socket } from "net";
import { UBXParser } from "@nextlvlup/ubx-parser";

const client = new Socket();
const parser = new UBXParser();

client.connect({ host: "localhost", port: 1234 }, () => console.log("connected"));

// Pass data to the parser
client.on("data", (buffer) => parser.parse(buffer));
// Receiving parsed data
parser.on("data", (data) => console.log(data));
```

### Example over SerialPort

```ts
import { SerialPort } from "serialport";
import { UBXParser } from "@nextlvlup/ubx-parser";

const serialport = new SerialPort({ path: "/dev/ttyS0", baudRate: 460800 }, () => console.log("gps connected"));
const parser = new UBXParser();

// Pass data to the parser
port.on("data", (buffer) => parser.parse(buffer));
// Receiving parsed data
parser.on("data", (data) => console.log(data));
```

### Data Object

The object returned in the data listener always contains a `packet_class` and a `packet_id`. These are used to identify what kind of packet it is. The remaining fields are packet-type dependent.

| Field        | Type  | Example |
| ------------ | ----- | ------- |
| packet_class | uint8 | 0x01    |
| packet_id    | uint8 | 0x07    |
| ...          | ...   | ...     |

### Create Custom Packet-Parser

You can also create your own packet parser if you need a packet that is not yet supported by this library.

```ts
import { UBXParser, readBitFromUInt8, readBitFromUInt16, readBitFromUInt32 } from "@nextlvlup/ubx-parser";

export class CustomParser extends PacketParser {
    constructor() {
        // pass packet_class and packet_id for identification
        super(0x01, 0x07);
    }

    parse(payload: Buffer): CustomData {
        return {
            // read uint32 starting at byte 0
            iTOW: payload.readUInt32LE(0),
            // read uint16 starting at byte 4
            year: payload.readUInt16LE(4),
            // read uint8 starting at byte 6
            month: payload.readUInt8(6),
            // read bit 0 from uint8 byte 7
            validDate: readBitFromUInt8(payload.readUInt8(7), 0),
            // read bit 0 from uint16 byte 8
            invalidLlh: readBitFromUInt16(payload.readUInt16LE(8), 0),
            // read bit 24 - 29 from uint32 byte 10
            dataType: readBitFromUInt32(payload.readUInt32LE(10), 24, 6),
        };
    }
}

export interface CustomData {
    iTOW: number;
    year: number;
    month: number;
    validDate: number;
    invalidLlh: number;
    dataType: number;
}
```

Then the CustomParser can be registered in the UBXParser instance.

```ts
import { UBXParser } from "@nextlvlup/ubx-parser";
import { CustomParser } from "path/to/your/CustomParser";

const parser = new UBXParser();
parser.registerParser(new CustomParser());
```
