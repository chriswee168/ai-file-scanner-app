import {ActionButton} from "./ActionButton.js";

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
     * Method to execute when scan button is clicked by the user.
     */
    async actionOnClick()
    {
        
    }
}