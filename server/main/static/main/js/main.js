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
            new ProgressBar(classBarElements[i], classBarLabels[i], labelMsgs[i])
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