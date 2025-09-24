import { ProgressBar } from "./ProgressBar.js";

/**
 * Function to create the progress bars for chunk scanning and
 * the byte chunk categories.
 * 
 * @returns Progress bar objects for chunk scanning and categories.
 */
export function createProgressBars()
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