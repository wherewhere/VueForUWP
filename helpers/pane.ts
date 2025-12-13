import { isSettingsPaneSupported } from "./utils";
import { homepage, bugs } from "../package.json";

if (isSettingsPaneSupported) {
    const settingsPane = Windows.UI.ApplicationSettings.SettingsPane.getForCurrentView();
    settingsPane.addEventListener("commandsrequested", args => {
        args.request.applicationCommands.append(
            new Windows.UI.ApplicationSettings.SettingsCommand(
                "Feedback",
                "Feedback",
                () => Windows.System.Launcher.launchUriAsync(new Windows.Foundation.Uri(bugs.url))
            ));
        args.request.applicationCommands.append(
            new Windows.UI.ApplicationSettings.SettingsCommand(
                "Repository",
                "Repository",
                () => Windows.System.Launcher.launchUriAsync(new Windows.Foundation.Uri(homepage))
            ));
    });
}