import { powershell } from "electron-windows-msix/lib/powershell.js";

const results = await powershell("Add-AppxPackage -Path appx/msix_layout/AppxManifest.xml -Register");
console.log(results);