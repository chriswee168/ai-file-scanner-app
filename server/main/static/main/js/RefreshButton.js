import {ActionButton} from "./ActionButton.js";

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
     */
    constructor(htmlElement)
    {
        super(htmlElement);

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