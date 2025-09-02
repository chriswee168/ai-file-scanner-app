import {ActionButton} from "./ActionButton.js";
import { FileList } from "./FileList.js";

/**
 * Class to define behaviour for refresh button responsible for
 * updating the list of files available for user selection.
 */
export class RefreshButton extends ActionButton
{
    /**
     * Constructor.
     * 
     * @param {HTMLElement} htmlElement HTML element of refresh button.
     * @param {FileList} fileList FileList object.
     * @param {HTMLElement} pathElement HTML element of directory path.
     */
    constructor(htmlElement, fileList, pathElement)
    {
        super(htmlElement);

        // File list element to send filepaths to.
        this.fileList = fileList;

        // Directory to path.
        this.pathElement = pathElement;

        // Add event listener for mouse click.
        this.htmlElement.addEventListener("click", () => this.actionOnClick());
    }

    /**
     * Method to execute when refresh button is clicked by the user.
     */
    async actionOnClick()
    {
        
    }
}