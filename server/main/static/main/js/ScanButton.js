import {ActionButton} from "./ActionButton.js";
import { FileList } from "./FileList.js";
import { ModelList } from "./ModelList.js";

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
     */
    constructor(htmlElement)
    {
        super(htmlElement);

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
     * Method to execute when scan button is clicked by the user.
     */
    async actionOnClick()
    {
        
    }
}