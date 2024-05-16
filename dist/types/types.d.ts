/**
 * Common typescript definitions
 */
export declare enum UBX_GnssId {
    GPS = 0,
    SBAS = 1,
    GALILEO = 2,
    BEIDOU = 3,
    QZSS = 5,
    GLONASS = 6,
    NAVIC = 7
}
export type UBX_GnssId_Strings = keyof typeof UBX_GnssId;
