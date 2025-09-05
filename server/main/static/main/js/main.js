import { RefreshButton } from "./RefreshButton.js";
import { FileList } from "./FileList.js";
import { ModelList } from "./ModelList.js";
import { DropDownButton } from "./DropDownButton.js";
import { ScanButton } from "./ScanButton.js";

/**
 * Main function to call for overall HTML page area.
 */
function main()
{
    // Get directory path element.
    let pathElement = document.getElementById("path-textbox");

    // File metadata textbox element.
    let metadataTextElement = document.getElementById("metadata-textbox");

    // Create scan button object.
    let scanButtonElement = document.getElementById("scan-button");
    let scanButtonObj = new ScanButton(scanButtonElement);

    // Create file list object.
    let fileListElement = document.getElementById("file-list");
    let fileListObj = new FileList(fileListElement, metadataTextElement);

    // Create AI model list object.
    let modelListElement = document.getElementById("model-list");
    let modelListObj = new ModelList(modelListElement, scanButtonObj, fileListObj);

    // Create refresh button object.
    let refreshButtonElement = document.getElementById("refresh-button");
    let refreshButtonObj = new RefreshButton(refreshButtonElement, fileListObj, pathElement);

    // Create drop down button object.
    let modelSelectButton = document.getElementById("model-select-button");
    let dropDownObj = new DropDownButton(modelSelectButton, modelListElement);

    // Link model list and scan button objects to file list.
    fileListObj.linkModelList(modelListObj);
    fileListObj.linkScanButton(scanButtonObj);

    // Link model list and file list to scan button.
    scanButtonObj.linkModelList(modelListObj);
    scanButtonObj.linkFileList(fileListObj);
}

/**
 * Call main function only when HTML page has been loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
    main();
});