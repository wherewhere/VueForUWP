import { packageMSIX } from "electron-windows-msix";

/** @type {import("electron-windows-msix").WindowsSignOptions} */
let windowsSignOptions = undefined;
const certificateFileIndex = process.argv.indexOf("--certificateFile");
if (certificateFileIndex != -1) {
    windowsSignOptions = {
        certificateFile: process.argv[certificateFileIndex + 1]
    };
    const certificatePasswordIndex = process.argv.indexOf("--certificatePassword");
    if (certificatePasswordIndex != -1) {
        windowsSignOptions.certificatePassword = process.argv[certificatePasswordIndex + 1];
    }
    const timestampServerIndex = process.argv.indexOf("--timestampServer");
    if (timestampServerIndex != -1) {
        windowsSignOptions.timestampServer = process.argv[timestampServerIndex + 1];
    }
}

const {msixPackage} = await packageMSIX({
    appManifest: "AppxManifest.xml",
    appDir: "dist",
    packageAssets: "assets",
    outputDir: "appx",
    packageName: "VueForUWP.msix",
    windowsKitVersion: "10.0.26100.0",
    windowsSignOptions,
    sign: !!windowsSignOptions
});
console.log(`MSIX package created at: ${msixPackage}`);