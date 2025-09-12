import { ActionButton } from "./ActionButton.js";

/**
 * DropDownButton class controls whether another HTML element (e.g. menu list)
 * is displayed on front page.
 */
export class DropDownButton extends ActionButton
{

    /**
     * Constructor.
     * 
     * @param {HTMLElement} htmlElement HTML element for button element.
     * @param {HTMLElement} elementToDisplay HTML element to display/remove if button pressed.
     */
    constructor(buttonElement, elementToDisplay)
    {
        super(buttonElement)
        this.elementToDisplay = elementToDisplay;
        this.elementDisplayed = false;

        this.availableStyle = [
            "rgb(206, 206, 206)", "rgb(255, 255, 255)", "rgb(132, 132, 132)"
        ];
        this.unavailableStyle = [
            "rgb(206, 206, 206)", "rgb(255, 255, 255)", "rgb(132, 132, 132)"
        ];

        this.setAvailability(true);

        this.htmlElement.addEventListener("click", () => this.actionOnClick());
    }

    /**
     * Method to call when button is pressed to display and remove 
     * the `elementToDisplay` in HTML page.
     */
    actionOnClick()
    {
        if (!this.elementDisplayed)
        {
            this.elementToDisplay.style.display = "block";
            this.elementDisplayed = true;
        }
        else
        {
            this.elementToDisplay.style.display = "none";
            this.elementDisplayed = false;
        }
    }
}