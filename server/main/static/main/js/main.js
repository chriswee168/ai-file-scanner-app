import { RefreshButton } from "./RefreshButton.js";
import { FileList } from "./FileList.js";
import { ModelList } from "./ModelList.js";
import { DropDownButton } from "./DropDownButton.js";

/**
 * Main function to call for overall HTML page area.
 */
function main()
{
    // Get directory path element.
    let pathElement = document.getElementById("path-textbox");

    // File metadata textbox element.
    let metadataTextElement = document.getElementById("metadata-textbox");

    // Create file list object.
    let fileListElement = document.getElementById("file-list");
    let fileListObj = new FileList(fileListElement, metadataTextElement);

    // Create refresh button object.
    let refreshButtonElement = document.getElementById("refresh-button");
    let refreshButtonObj = new RefreshButton(refreshButtonElement, fileListObj, pathElement);

    // Create AI model list object.
    let modelListElement = document.getElementById("model-list");
    let modelListObj = new ModelList(modelListElement);

    // Create drop down button object.
    let modelSelectButton = document.getElementById("model-select-button");
    let dropDownObj = new DropDownButton(modelSelectButton, modelListElement);
}

/**
 * Call main function only when HTML page has been loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
    main();
});