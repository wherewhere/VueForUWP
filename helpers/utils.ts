import "../types";

export const isWindows = typeof Windows !== "undefined";
export const isUserActivityChannelSupported = isWindows && Windows.Foundation.Metadata.ApiInformation.isTypePresent("Windows.ApplicationModel.UserActivities.UserActivityChannel");
export const isSettingsPaneSupported = isWindows && Windows.Foundation.Metadata.ApiInformation.isTypePresent("Windows.UI.ApplicationSettings.SettingsPane");
export const isApplicationViewViewModeSupported = isWindows && Windows.Foundation.Metadata.ApiInformation.isPropertyPresent("Windows.UI.ViewManagement.ApplicationView", "ViewMode");

export function setTimeoutAsync(timeout?: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, timeout));
}