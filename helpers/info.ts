import "../types";
import Bowser from "bowser";
import { isWindows } from "../helpers/utils";
import { name, version as code } from "../package.json";

export const userAgent = navigator.userAgent;
const parser = Bowser.getParser(userAgent, true);
export const browser = parser.parseBrowser();
export const engine = parser.parseEngine();
let device = "Browser";
let osVersion = "Unknown";
let version = `${name} v${code}`;
if (isWindows) {
    const versionInfo = Windows.System.Profile.AnalyticsInfo.versionInfo;
    device = versionInfo.deviceFamily.replace('.', ' ');
    const deviceFamilyVersion = +versionInfo.deviceFamilyVersion;
    osVersion = `Windows 10.${deviceFamilyVersion & 0x0000FFFF00000000}.${(deviceFamilyVersion & 0x00000000FFFF0000) >> 16}.${deviceFamilyVersion & 0x000000000000FFFF}`;
    const _package = Windows.ApplicationModel.Package.current;
    version = `${_package.displayName} v${_package.id.version.major}.${_package.id.version.minor}.${_package.id.version.build}`;
}
else {
    function toUpperCaseFirstLetter(str: string) {
        return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
    }
    const platform = parser.parsePlatform();
    if (platform.type) {
        device += ` ${toUpperCaseFirstLetter(platform.type)}`;
    }
    const os = parser.parseOS();
    osVersion = getName(os);
}
export { device, osVersion, version };

export function getName({ name, version }: Bowser.Parser.Details): string {
    name = name || "Unknown";
    return version ? `${name} ${version}` : name;
}