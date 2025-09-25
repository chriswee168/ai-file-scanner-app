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
     * @param {Object<string, string>} availableStyle Styles to apply to button when available.
     * @param {Object<string, string>} unavailableStyle Styles to apply to button when unavailable.
     * @param {Object<string, string>} buttonTexts Button text to use when refresh button is pressed 
     * and original text message.
     */
    constructor(buttonElement, elementToDisplay, availableStyle, unavailableStyle, buttonTexts)
    {
        super(buttonElement, availableStyle, unavailableStyle, buttonTexts);
        this.elementToDisplay = elementToDisplay;
        this.elementDisplayed = false;

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