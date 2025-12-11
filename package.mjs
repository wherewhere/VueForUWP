import { packageMSIX } from "electron-windows-msix";

const {msixPackage} = await packageMSIX({
    appManifest: "AppxManifest.xml",
    appDir: "dist",
    packageAssets: "assets",
    outputDir: "appx",
    packageName: "VueForUWP.appx",
    windowsKitVersion: "10.0.26100.0",
    sign: false
});
console.log(`MSIX package created at: ${msixPackage}`);