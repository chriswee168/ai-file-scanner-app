import { RefreshButton } from "./RefreshButton.js";

/**
 * Main function to call for overall HTML page area.
 */
function main()
{
    // Create refresh button object.
    let refreshButtonElement = document.getElementById("refresh-button");
    let refreshButtonObj = new RefreshButton(refreshButtonElement);
}

/**
 * Call main function only when HTML page has been loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
    main();
});