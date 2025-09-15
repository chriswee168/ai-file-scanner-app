import { RefreshButton } from "./RefreshButton.js";
import { FileList } from "./FileList.js";
import { ModelList } from "./ModelList.js";
import { DropDownButton } from "./DropDownButton.js";
import { ScanButton } from "./ScanButton.js";
import { ResultReceiver } from "./ResultReceiver.js";
import { ProgressBar } from "./ProgressBar.js";

/**
 * Main function to call for overall HTML page area.
 */
function main()
{
    // Get directory path element.
    let pathElement = document.getElementById("path-textbox");

    // File metadata textbox element.
    let metadataTextElement = document.getElementById("metadata-textbox");

    // Customizations for button elements.
    let buttonStyleAvailable = {
        "backgroundColor": "rgb(8, 98, 0)", 
        "color": "rgb(255, 255, 255)", 
        "mouseOverBackgroundColor": "rgb(5, 60, 0)"
    };

    let buttonStyleUnavailable = {
        "backgroundColor": "rgb(98, 0, 0)", 
        "color": "rgb(255, 255, 255)", 
        "mouseOverBackgroundColor": "rgb(63, 0, 0)"
    };

    let dropDownButtonStyle = {
        "backgroundColor": "rgb(72, 72, 72)", 
        "color": "rgb(255, 255, 255)", 
        "mouseOverBackgroundColor": "rgb(53, 53, 53)"
    }

    // Create scan button object.
    let scanButtonElement = document.getElementById("scan-button");
    let scanButtonObj = new ScanButton(
        scanButtonElement, buttonStyleAvailable, buttonStyleUnavailable,
        {"availableMsg": "SCAN FILE BYTES", "unAvailableMsg": "SCAN FILE BYTES"},
        "CANCEL SCANNING"
    );

    // Create file list object.
    let fileListElement = document.getElementById("file-list");
    let fileListObj = new FileList(
        fileListElement, metadataTextElement,
        {"color": "rgb(14, 168, 0)"},
        {"color": "rgb(175, 175, 175)"},
        {"color": "white"}
    );

    // Create AI model list object.
    let modelListElement = document.getElementById("model-list");
    let modelListObj = new ModelList(
        modelListElement, scanButtonObj, fileListObj,
        {"color": "white", "backgroundColor": "rgb(89, 89, 89)"},
        {"color": "white", "backgroundColor": "rgb(72, 72, 72)"},
        {"color": "white", "backgroundColor": "rgb(53, 53, 53)"},
    );

    // Create refresh button object.
    let refreshButtonElement = document.getElementById("refresh-button");
    let refreshButtonObj = new RefreshButton(
        refreshButtonElement, fileListObj, pathElement, 
        buttonStyleAvailable, buttonStyleUnavailable,
        {"availableMsg": "REFRESH", "unAvailableMsg": "REFRESHING..."}
    );

    // Create drop down button object.
    let modelSelectButton = document.getElementById("model-select-button");
    let dropDownObj = new DropDownButton(
        modelSelectButton, modelListElement, dropDownButtonStyle, dropDownButtonStyle,
        {"availableMsg": "Select Model", "unAvailableMsg": "Select Model"}
    );

    // Create result receiver object.
    let resultReceiver = new ResultReceiver();

    // Link model list and scan button objects to file list.
    fileListObj.linkModelList(modelListObj);
    fileListObj.linkScanButton(scanButtonObj);

    // Link model list and file list to scan button.
    scanButtonObj.linkModelList(modelListObj);
    scanButtonObj.linkFileList(fileListObj);
    scanButtonObj.linkResultReceiver(resultReceiver);

    // Link chunk scanning and class/category progress bars to result receiver.
    let [chunkScanBarObj, classBarObjs] = createProgBarObjs();
    resultReceiver.setChunkScanBar(chunkScanBarObj);
    resultReceiver.setCategoryBars(classBarObjs);
    resultReceiver.setScanButton(scanButtonObj);
}

/**
 * Function to create the progress bars for chunk scanning and
 * the byte chunk categories.
 * 
 * @returns Progress bar objects for chunk scanning and categories.
 */
function createProgBarObjs()
{
    // Get progress bar elements and create result receiver object.
    let chunkProgBarElement = document.getElementById("chunk-prog-bar");
    let chunkProgBarLabel = document.getElementById("chunk-prog-bar-label");
    let classBarElements = document.querySelectorAll(".class-bar");
    let classBarLabels = document.querySelectorAll(".class-bar-label");

    // Create the chunk scanning progress bar object.
    let chunkScanBarObj = new ProgressBar(
        chunkProgBarLabel, chunkProgBarElement, "Chunk scan progress"
    );

    // Create progress bar object for each category.
    let labelMsgs = ["Clean", "Warning", "Malicious"];
    let classBarObjs = [];
    for (let i = 0; i < classBarElements.length; i++)
    {
        classBarObjs.push(
            new ProgressBar(classBarLabels[i], classBarElements[i], labelMsgs[i])
        );
    }

    return [chunkScanBarObj, classBarObjs];
}

/**
 * Call main function only when HTML page has been loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
    main();
});