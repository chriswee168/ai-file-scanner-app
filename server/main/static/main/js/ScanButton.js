import {ActionButton} from "./ActionButton.js";
import { FileList } from "./FileList.js";
import { ModelList } from "./ModelList.js";
import { ResultReceiver } from "./ResultReceiver.js";

/**
 * Class to define behaviour of scan button responsible for
 * initiating the byte chunk scanning process.
 */
export class ScanButton extends ActionButton
{
    /**
     * Constructor.
     * 
     * @param {HTMLElement} htmlElement HTML element of scan button.
     * @param {Object<string, string>} availableStyle Styles to apply to button when available.
     * @param {Object<string, string>} unavailableStyle Styles to apply to button when unavailable.
     * @param {Object<string, string>} buttonTexts Button texts to display when button is available/unavailable.
     */
    constructor(htmlElement, availableStyle, unavailableStyle, buttonTexts)
    {
        super(htmlElement, availableStyle, unavailableStyle, buttonTexts);

        this.allowCancel = false;

        // Add event listener for mouse click.
        this.htmlElement.addEventListener("click", () => this.actionOnClick());
    }

    /**
     * Setter to add model list object.
     * 
     * @param {ModelList} modelList Model list object.
     */
    linkModelList(modelList)
    {
        this.modelList = modelList;
    }

    /**
     * Setter to add file list object.
     * 
     * @param {FileList} fileList File list object.
     */
    linkFileList(fileList)
    {
        this.fileList = fileList;
    }

    /**
     * Setter to add result receiver object.
     * 
     * @param {ResultReceiver} resultReceiver Result receiver object.
     */
    linkResultReceiver(resultReceiver)
    {
        this.resultReceiver = resultReceiver;
    }

    /**
     * Method to execute when scan button is clicked by the user.
     */
    async actionOnClick()
    {
        if (this.available)
        {
            // Get filepath of selected file and name of selected AI model.
            let filePath = this.fileList.selectedEntry.metadata.absolute_path;
            let modelName = this.modelList.selectedEntry.element.innerText;

            let data = {"filePath": filePath, "modelName": modelName};

            // Start server side event to continuously receive
            // byte chunk predictions.
            this.resultReceiver.startStream(data);

        }
        else
        {
            // Allow scan button to cancel scanning process.
            if (this.resultReceiver.scanInProgress)
            {
                this.allowCancel = true;
            }
        }
    }
}